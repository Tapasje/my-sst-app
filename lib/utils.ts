/**
 * Domain Utilities for SST v3
 * 
 * Provides environment detection and domain configuration based on stage and region
 * No environment variables required - all configuration is hardcoded per environment
 */

/**
 * Domain configuration interface
 */
interface DomainConfig {
  hostedZone: string;
  domain: string;
  authDomainPrefix: string;
}

/**
 * Environment detection utilities
 */
export const Env = {
  /**
   * Is this a production environment?
   * Production stages start with 'prd'
   */
  isProduction: () => $app.stage.startsWith('prd'),
  
  /**
   * Is this a test environment?
   * Test stages start with 'tst'
   */
  isTest: () => $app.stage.startsWith('tst'),
  
  /**
   * Is this a development environment?
   * Dev is either exactly 'dev' or starts with 'dev-'
   */
  isDev: () => $app.stage === 'dev' || $app.stage.startsWith('dev'),
  
  /**
   * Is this a local development environment?
   * Local is either in $dev mode or has stage 'local'
   */
  isLocal: () => $dev || $app.stage === 'local',
  
  /**
   * Is this a multi-region deployment?
   * Production environments use multi-region deployments
   */
  isMultiRegion: () => Env.isProduction(),
  
  /**
   * Get current region prefix (eu/us)
   * Defaults to eu if region can't be determined
   */
  getRegionPrefix: async () => {
    const region = await aws.getRegion({});
    
    return region.name.startsWith('us-') ? 'us' : 'eu';
  }
};

/**
 * Hardcoded domain configurations for each environment type
 */
const domainConfigs = {
  // Production environment domains
  production: {
    hostedZone: 'portal.oncosignal.com',
    domain: 'PREFIX.portal.oncosignal.com',
    authDomainPrefix: 'PREFIX-portal-oncosignal-auth'
  },
  
  // Test environment domains
  test: {
    hostedZone: 'tst.portal.oncosignal.com',
    domain: 'PREFIX.tst.portal.oncosignal.com',
    authDomainPrefix: 'PREFIX-tst-portal-oncosignal-auth'
  },
  
  // Development environment domains
  dev: {
    hostedZone: 'dev.portal.oncosignal.com',
    domain: 'PREFIX.dev.portal.oncosignal.com',
    authDomainPrefix: 'PREFIX-dev-portal-oncosignal-auth'
  },
  
  // Local development environment domains
  local: {
    hostedZone: 'dev.portal.oncosignal.com',
    domain: 'PREFIX.STAGE.dev.portal.oncosignal.com',
    authDomainPrefix: 'PREFIX-STAGE-dev-portal-oncosignal-auth'
  }
};

/**
 * Get domain configuration for the current environment
 * 
 * @returns Domain configuration based on the current stage and region
 */
export async function getDomainConfig(): Promise<DomainConfig> {
  // Determine which base configuration to use
  let baseConfig: DomainConfig;
  if (Env.isProduction()) {
    baseConfig = { ...domainConfigs.production };
  } else if (Env.isTest()) {
    baseConfig = { ...domainConfigs.test };
  } else if (Env.isDev()) {
    baseConfig = { ...domainConfigs.dev };
  } else {
    baseConfig = { ...domainConfigs.local };
  }
  
  // Apply region prefix
  const prefix = await Env.getRegionPrefix();
  baseConfig.domain = baseConfig.domain.replace('PREFIX', prefix);
  baseConfig.authDomainPrefix = baseConfig.authDomainPrefix.replace('PREFIX', prefix);
  
  // For local environment, replace STAGE with actual stage name
  if (Env.isLocal()) {
    const stage = $app.stage;
    baseConfig.domain = baseConfig.domain.replace('STAGE', stage);
    baseConfig.authDomainPrefix = baseConfig.authDomainPrefix.replace('STAGE', stage);
  }
  
  return baseConfig;
}

/**
 * Get the VPC CIDR block for networking
 * Same for all environments for simplicity
 */
export function getVpcCidr(): string {
  return '10.0.0.0/16';
}

/**
 * Usage Example:
 * 
 * import { getDomainConfig, Env } from './domain-utils';
 * 
 * export default {
 *   // ...
 *   stacks(app) {
 *     app.stack(function ApiStack({ stack }) {
 *       // Get domain configuration based on environment
 *       const domain = getDomainConfig();
 *       
 *       // Create API with custom domain
 *       const api = new aws.apigateway.RestApi("Api", {
 *         // API configuration
 *       });
 *       
 *       // Create custom domain
 *       const apiDomain = new aws.apigateway.DomainName("ApiDomain", {
 *         domainName: domain.domain,
 *         // Certificate configuration
 *       });
 *       
 *       // Apply environment-specific configuration
 *       if (Env.isProduction()) {
 *         // Add additional security for production
 *       }
 *       
 *       // Output the API URL
 *       stack.output("ApiUrl", $interpolate`https://${domain.domain}/`);
 *     });
 *   }
 * };
 */