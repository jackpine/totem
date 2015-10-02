//
//  TMLocationManager.m
//  Totem
//
//  Created by sam on 10/2/15.
//  Copyright © 2015 totem. All rights reserved.
//

#import "TMLocationManager.h"

@implementation TMLocationManager
{
  NSMutableArray *_locationUpdateCallbacks;
}

RCT_EXPORT_MODULE();

- (instancetype)init
{
  if ((self = [super init])) {
     _locationUpdateCallbacks = [NSMutableArray new];
  }
  return self;
}

RCT_EXPORT_METHOD(listenForLocationUpdates:(NSDictionary *)args callback:(RCTResponseSenderBlock)callback){
  [_locationUpdateCallbacks addObject:callback ?: ^(__unused id unused) {}];
  NSLog(@"recieved a callback for location updates");
  callback(@[[NSNull null], @"Hello from objective c"]);

}

@end


