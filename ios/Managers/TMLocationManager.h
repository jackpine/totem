//
//  TMLocationManager.h
//  Totem
//
//  Created by sam on 10/2/15.
//  Copyright © 2015 totem. All rights reserved.
//

// XXX fixme, whats the proper import here?
#import <MapKit/MapKit.h>
#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"


@interface TMLocationManager : NSObject <RCTBridgeModule, CLLocationManagerDelegate>
@property BOOL firstLocationUpdate;
@property NSMutableDictionary *markers;
@property CLLocationManager *locationManager;
@property CLLocation* lastLocation;
@end
