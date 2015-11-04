//
//  TMConstants.h
//  Totem
//
//  Created by sam on 11/4/15.
//  Copyright © 2015 totem. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@interface TMGlobals : NSObject <RCTBridgeModule>

- (BOOL) isDebugBuild;

- (BOOL) isAdHocBuild;

- (BOOL) isAppStoreBuild;

@end
