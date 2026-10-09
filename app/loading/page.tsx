"use client";

import LoadingPage from "../components/LoadingPage";

export default function LoadingTestPage() {
  return (
    <div>
      <LoadingPage 
        show={true}
        fadeIn={false}
        fadeOut={false}
        timeWait={999}
      />
    </div>
  );
}

