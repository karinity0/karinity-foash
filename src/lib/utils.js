import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function trimSvgViewBox(svgEl, options = {}) {
  if (!svgEl || !(svgEl instanceof SVGElement)) {
    throw new Error("trimSvgViewBox: svgEl must be an SVGElement");
  }

  const {
    width = null,
    height = null,
    padding = 0,
    removeAttrs = true,
  } = options;

  // optional cleanup
  if (removeAttrs) {
    svgEl.removeAttribute("viewBox");
    // keep width/height removal optional depending on desired result
    // svgEl.removeAttribute('width');
    // svgEl.removeAttribute('height');
  }

  // helper: decide if node should be skipped
  function isSkippable(node) {
    if (!(node instanceof Element)) return true;
    const tag = node.tagName.toLowerCase();
    if (["defs", "style", "title", "desc"].includes(tag)) return true;
    const cs = getComputedStyle(node);
    if (
      cs &&
      (cs.display === "none" ||
        cs.visibility === "hidden" ||
        cs.opacity === "0")
    )
      return true;
    return false;
  }

  // gather candidate elements (descendants that draw something)
  const candidates = [];
  (function walk(node) {
    for (let child of node.children) {
      if (isSkippable(child)) {
        // still walk inside groups because group may contain visible things
        if (child.children && child.children.length) walk(child);
        continue;
      }
      // If it's a group with children, inspect children recursively (we'll still include group too)
      if (child.children && child.children.length) {
        // include group itself too (it may have transforms)
        candidates.push(child);
        walk(child);
      } else {
        candidates.push(child);
      }
    }
  })(svgEl);

  // if no candidates, fall back to top-level children (avoid empty svg)
  if (candidates.length === 0) {
    for (let c of svgEl.children) {
      if (!isSkippable(c)) candidates.push(c);
    }
    if (candidates.length === 0) {
      // nothing to measure — return current svg
      const currentViewBox = svgEl.getAttribute("viewBox") || null;
      return {
        svg: svgEl,
        outerHTML: svgEl.outerHTML,
        viewBox: currentViewBox,
      };
    }
  }

  // compute min/max by transforming each element's bbox into root SVG coordinates
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  candidates.forEach((el) => {
    try {
      // getBBox works in the element's own user units
      const bbox = el.getBBox();
      // getCTM maps from the element's coordinate system to the SVG root user coordinate system
      // If getCTM() is null in some browsers for certain nodes, use identity matrix fallback
      const ctm = el.getCTM ? el.getCTM() : svgEl.createSVGMatrix();

      // corners of bbox
      const corners = [
        { x: bbox.x, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y },
        { x: bbox.x, y: bbox.y + bbox.height },
        { x: bbox.x + bbox.width, y: bbox.y + bbox.height },
      ];

      corners.forEach((pt) => {
        // transform point by CTM
        const svgPt = svgEl.createSVGPoint();
        svgPt.x = pt.x;
        svgPt.y = pt.y;
        const transformed = svgPt.matrixTransform(ctm);
        if (!Number.isFinite(transformed.x) || !Number.isFinite(transformed.y))
          return;
        if (transformed.x < minX) minX = transformed.x;
        if (transformed.y < minY) minY = transformed.y;
        if (transformed.x > maxX) maxX = transformed.x;
        if (transformed.y > maxY) maxY = transformed.y;
      });
    } catch (err) {
      // some nodes throw on getBBox() (like <foreignObject> in some browsers) — ignore
      // console.warn('trimSvgViewBox: skipping element', el, err);
    }
  });

  if (
    minX === Infinity ||
    minY === Infinity ||
    maxX === -Infinity ||
    maxY === -Infinity
  ) {
    // nothing measured; return original
    const currentViewBox = svgEl.getAttribute("viewBox") || null;
    return { svg: svgEl, outerHTML: svgEl.outerHTML, viewBox: currentViewBox };
  }

  // apply padding
  const pad = Number(padding) || 0;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;

  const vbX = minX;
  const vbY = minY;
  const vbW = maxX - minX;
  const vbH = maxY - minY;

  // set viewBox (with two decimals for neatness)
  const viewBoxStr = `${vbX.toFixed(2)} ${vbY.toFixed(2)} ${vbW.toFixed(
    2
  )} ${vbH.toFixed(2)}`;
  svgEl.setAttribute("viewBox", viewBoxStr);

  // If the caller asked to set either width/height — set only one to preserve aspect ratio.
  if (width != null && height != null) {
    // both provided — set both (may stretch)
    svgEl.setAttribute("width", String(width));
    svgEl.setAttribute("height", String(height));
  } else if (width != null) {
    svgEl.setAttribute("width", String(width));
    svgEl.removeAttribute("height"); // responsive height
  } else if (height != null) {
    svgEl.setAttribute("height", String(height));
    svgEl.removeAttribute("width"); // responsive width
  } else {
    // keep responsive: remove explicit width/height so CSS controls sizing
    svgEl.removeAttribute("width");
    svgEl.removeAttribute("height");
  }

  // ensure inline block to avoid external inline gaps
  svgEl.style.display = svgEl.style.display || "block";

  return { svg: svgEl, outerHTML: svgEl.outerHTML, viewBox: viewBoxStr };
}
