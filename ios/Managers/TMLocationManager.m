//
//  TMLocationManager.m
//  Totem
//
//  Created by sam on 10/2/15.
//  Copyright © 2015 totem. All rights reserved.
//

#import "TMLocationManager.h"
#import "RCTEventDispatcher.h"
#import "RCTBridge.h"


@implementation TMLocationManager
{
  NSMutableArray *_locationUpdateCallbacks;
  
}

@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

- (instancetype)init
{
  if ((self = [super init])) {
     _locationUpdateCallbacks = [NSMutableArray new];
    
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    self.locationManager.distanceFilter = kCLDistanceFilterNone;
    
  }
  return self;
}

RCT_EXPORT_METHOD(startLocationUpdates:(NSDictionary *)args callback:(RCTResponseSenderBlock)callback){
  [_locationUpdateCallbacks addObject:callback ?: ^(__unused id unused) {}];
  NSLog(@"recieved a callback for location updates");
  callback(@[[NSNull null], @"Starting location updates"]);
  
}

- (NSDictionary *)constantsToExport
{
  return @{ @"locationUpdatesEventChannel": @"location-update-events" };
}

#pragma mark - CLLocationManager Delegate methods

// This method is called whenever the application’s ability to use location
// services changes. Changes can occur because the user allowed or denied the
// use of location services for your application or for the system as a whole.
//
// If the authorization status is already known when you call the
// requestWhenInUseAuthorization or requestAlwaysAuthorization method, the
// location manager does not report the current authorization status to this
// method. The location manager only reports changes to the authorization
// status. For example, it calls this method when the status changes from
// kCLAuthorizationStatusNotDetermined to kCLAuthorizationStatusAuthorizedWhenInUse.
-(void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
  NSLog(@"did change authorization status: %@", @(status));
  CLAuthorizationStatus notDetermined = kCLAuthorizationStatusNotDetermined;
  CLAuthorizationStatus denied = kCLAuthorizationStatusDenied;
  if (status != notDetermined && status != denied) {
    [manager startUpdatingLocation];
  } else {
    NSLog(@"Cannot update location because:");
    if (status == notDetermined) {
      NSLog(@"CoreLocation authorization is not determined");
    } else {
      NSLog(@"CoreLocation authorization is denied");
    }
    [manager requestWhenInUseAuthorization];
  }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations{
  CLLocation *myLoc = [locations lastObject];
  self.lastLocation = myLoc;
  NSLog(@"my location is: %f, %f", myLoc.coordinate.latitude, myLoc.coordinate.longitude);
  self.firstLocationUpdate = YES;

  NSNumber *currFloor;
  if(!myLoc.floor)
    currFloor = [NSNumber numberWithLong:-1];
  else
    currFloor = [NSNumber numberWithLong:myLoc.floor.level];
  
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  NSLocale *enUSPOSIXLocale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
  [dateFormatter setLocale:enUSPOSIXLocale];
  [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZZZ"];
  NSString *iso8601String = [dateFormatter stringFromDate:myLoc.timestamp];

  [self.bridge.eventDispatcher sendAppEventWithName:[self constantsToExport][@"locationUpdatesEventChannel"]
                                               body:@[@{@"lat":                [NSNumber numberWithDouble:myLoc.coordinate.latitude],
                                                        @"lng":                [NSNumber numberWithDouble:myLoc.coordinate.longitude],
                                                        @"horizontalAccuracy": [NSNumber numberWithDouble:myLoc.horizontalAccuracy],
                                                        @"verticalAccuracy":   [NSNumber numberWithDouble:myLoc.verticalAccuracy],
                                                        @"altitude":           [NSNumber numberWithDouble:myLoc.altitude],
                                                        @"floor":              currFloor,
                                                        @"timestamp":          iso8601String
                                                      }]];

}


@end


