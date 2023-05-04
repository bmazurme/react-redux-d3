/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

import type { PropsWithChildren } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

type ErrorBoundaryWrapperProps = PropsWithChildren<unknown>;

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="error-boundary">
      <div className="error-boundary__title">
        <h2 className="error-boundary__title">APP-ERROR </h2>
        <p className="error-boundary__message">{error.message}</p>

        <div className="error-boundary__block">
          Try to
          {/* eslint-disable-next-line react/button-has-type */}
          <button className="button button_reload" onClick={resetErrorBoundary}>
            Reload app
          </button>
          or
          {/* eslint-disable-next-line react/button-has-type */}
          <button className="link link_home" onClick={resetErrorBoundary}>
            Go to homepage
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ErrorBoundaryWrapper({
  children,
}: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary
      onReset={() => {}}
      FallbackComponent={ErrorFallback}
    >
      {children}
    </ErrorBoundary>
  );
}
