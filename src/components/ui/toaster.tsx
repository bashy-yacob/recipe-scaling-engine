// src/components/ui/toaster.tsx

import { 
  Toaster as ChakraToaster, 
  createToaster,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastCloseTrigger,
  ToastIndicator,
} from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'top',
  pauseOnPageIdle: true,
});

export function Toaster() {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast) => (
        <ToastRoot>
          <ToastIndicator />
          <Stack gap="1" flex="1" maxWidth="100%">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </Stack>
          <ToastCloseTrigger />
        </ToastRoot>
      )}
    </ChakraToaster>
  );
}
