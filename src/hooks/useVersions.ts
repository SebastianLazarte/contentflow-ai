import { useCallback, useEffect, useRef, useState } from "react";

export type ContentVersion = {
  id: string;
  stage: string;
  content: string | Record<string, unknown>;
  created_at: string;
};

type VersionsResponse = {
  ok?: boolean;
  versions?: ContentVersion[];
};

const EMPTY_VERSIONS: ContentVersion[] = [];

export function useVersions(
  prdId: string,
  intervalMs = 3000,
  initialVersions: ContentVersion[] = EMPTY_VERSIONS
) {
  const [versions, setVersions] = useState<ContentVersion[]>(initialVersions);
  const [loading, setLoading] = useState(initialVersions.length === 0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setVersions(initialVersions);
    setLoading(initialVersions.length === 0);
  }, [prdId, initialVersions]);

  const fetchVersions = useCallback(async () => {
    try {
      const res = await fetch(`/api/prd/${prdId}/versions`, {
        cache: "no-store",
      });
      const json: VersionsResponse = await res.json();
      if (json.ok && Array.isArray(json.versions) && isMountedRef.current) {
        setVersions(json.versions);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [prdId]);

  useEffect(() => {
    if (initialVersions.length === 0) {
      setLoading(true);
    }
    fetchVersions();
    const interval = setInterval(fetchVersions, intervalMs);
    return () => clearInterval(interval);
  }, [fetchVersions, intervalMs, initialVersions.length]);

  return { versions, loading, reload: fetchVersions };
}
