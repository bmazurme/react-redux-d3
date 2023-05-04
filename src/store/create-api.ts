import { buildCreateApi, coreModule, reactHooksModule } from '@reduxjs/toolkit/dist/query/react';

const createApi = buildCreateApi(
  coreModule(),
  reactHooksModule({ unstable__sideEffectsInRender: true }),
);

export default createApi;
