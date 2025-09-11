import { buildClerkProps } from 'svelte-clerk/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  const clerkProps = buildClerkProps(locals.auth());
  const clerk = { ...clerkProps.initialState };

  return {
    clerk,
  };
};
