import { BaseProps, ProductConfig } from '@/hooks/common/typing';
import { ViewEnum } from '@/typing';

export interface VerifyGeneralNormalProps {
  productGroupIdentify: string;
  viewType: keyof typeof ViewEnum;
  productConfig?: ProductConfig;
}
