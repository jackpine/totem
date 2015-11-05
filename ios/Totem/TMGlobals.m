//
//  TMConstants.m
//  Totem
//
//  Created by sam on 11/4/15.
//  Copyright © 2015 totem. All rights reserved.
//

#import "TMGlobals.h"

@implementation TMGlobals

RCT_EXPORT_MODULE();


#pragma export-constants

- (NSDictionary *)constantsToExport
{
  NSLog(@" %@",[self buildConfiguration]);
  return @{ @"debugBuild": @([self isDebugBuild]),
            @"adhocBuild": @([self isAdHocBuild]),
            @"appstoreBuild": @([self isAppStoreBuild]),
            @"buildType": [self buildConfiguration]
          };
}


# pragma build-args
- (NSString *) buildConfiguration {
  NSString *config;
#if DEBUG_BUILD
  config = @"debug";
#elif ADHOC_BUILD
  config = @"adhoc";
#elif APPSTORE_BUILD
  config = @"appstore";
#else
  config = @"unknown";
#endif
  return config;
}

- (BOOL) isDebugBuild {
  return [@"debug" isEqualToString:[self buildConfiguration]];
}

- (BOOL) isAdHocBuild {
  return [@"adhoc" isEqualToString:[self buildConfiguration]];
}

- (BOOL) isAppStoreBuild {
  return [@"appstore" isEqualToString:[self buildConfiguration]];
}

@end
