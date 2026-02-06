export type IntegrityEvent = {
  t: number;
  type: "visibility_hidden" | "visibility_visible" | "blur" | "focus" | "fullscreen_exit" | "copy" | "paste";
  meta?: Record<string, string | number | boolean>;
};
