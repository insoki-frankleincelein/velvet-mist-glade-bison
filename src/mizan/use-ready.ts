import { useEffect, useState } from "react";
import { useGuide } from "./store";

export function useReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let on = true;
    void Promise.resolve(useGuide.persist.rehydrate()).then(() => {
      if (on) setReady(true);
    });
    return () => {
      on = false;
    };
  }, []);
  return ready;
}
