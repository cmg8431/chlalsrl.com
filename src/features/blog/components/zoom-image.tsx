"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ZoomImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const DURATION = 320;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** 원본이 작아도 이 배율까지는 키워서 보여준다 */
const MAX_UPSCALE = 2;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// 오버레이는 body 포털 필수 — transform/애니메이션 조상이 fixed 기준을 바꾼다
export function ZoomImage({ alt = "", ...props }: ZoomImageProps) {
  const [open, setOpen] = useState(false);
  const inlineRef = useRef<HTMLImageElement>(null);
  const bigRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);
  const closingRef = useRef(false);

  const sizeBig = useCallback(() => {
    const big = bigRef.current;
    if (!big?.naturalWidth || !big.naturalHeight) return false;
    const scale = Math.min(
      (window.innerWidth * 0.94) / big.naturalWidth,
      (window.innerHeight * 0.9) / big.naturalHeight,
      MAX_UPSCALE,
    );
    big.style.width = `${big.naturalWidth * scale}px`;
    big.style.height = "auto";
    return true;
  }, []);

  const flipTransform = useCallback(() => {
    const from = inlineRef.current?.getBoundingClientRect();
    const big = bigRef.current;
    if (!from || !big) return null;
    const to = big.getBoundingClientRect();
    if (!to.width || !to.height || !from.width) return null;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${
      from.height / to.height
    })`;
  }, []);

  const close = useCallback(() => {
    if (closingRef.current) return;
    const big = bigRef.current;
    const overlay = overlayRef.current;
    const transform = reducedMotion() ? null : flipTransform();

    if (big && overlay && transform) {
      closingRef.current = true;
      big.style.transition = `transform ${DURATION}ms ${EASE}`;
      big.style.transform = transform;
      overlay.style.transition = `background-color ${DURATION}ms ease`;
      overlay.style.background = "transparent";
      overlay.style.backdropFilter = "none";
      window.setTimeout(() => {
        closingRef.current = false;
        setOpen(false);
      }, DURATION);
    } else {
      setOpen(false);
    }
  }, [flipTransform]);

  useEffect(() => {
    if (!open) return;

    const big = bigRef.current;
    const run = () => {
      if (!sizeBig()) return;
      if (reducedMotion()) return;
      const transform = flipTransform();
      if (!big || !transform) return;
      big.style.transition = "none";
      big.style.transform = transform;
      requestAnimationFrame(() => {
        big.style.transition = `transform ${DURATION}ms ${EASE}`;
        big.style.transform = "";
      });
    };
    if (big && !big.complete) big.addEventListener("load", run, { once: true });
    else run();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      big?.removeEventListener("load", run);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, flipTransform, sizeBig]);

  return (
    <>
      <span className="zoom-figure block">
        {/* eslint-disable-next-line next/no-img-element */}
        <img
          {...props}
          ref={inlineRef}
          alt={alt}
          loading="lazy"
          decoding="async"
          onClick={() => setOpen(true)}
          style={open ? { visibility: "hidden" } : undefined}
        />
      </span>
      {open &&
        createPortal(
          <span
            ref={overlayRef}
            className="zoom-overlay"
            role="button"
            aria-label="Close"
            onClick={close}
          >
            {/* eslint-disable-next-line next/no-img-element */}
            <img ref={bigRef} src={props.src as string} alt={alt} />
          </span>,
          document.body,
        )}
    </>
  );
}
