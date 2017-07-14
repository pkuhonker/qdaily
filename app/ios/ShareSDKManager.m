//
//  ShareSDKManager.m
//  RNShareSDK
//
//  Created by Kengsir on 16/6/28.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "ShareSDKManager.h"

#import <ShareSDK/ShareSDK.h>
#import <ShareSDKConnector/ShareSDKConnector.h>

//新浪微博SDK头文件
#import "WeiboSDK.h"

//腾讯开放平台（对应QQ和QQ空间）SDK头文件
#import <TencentOpenAPI/TencentOAuth.h>
#import <TencentOpenAPI/QQApiInterface.h>

//微信SDK头文件
#import "WXApi.h"

@implementation ShareSDKManager
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"success",@"fail",@"cancel"];
}

+ (void)ready {
  [ShareSDK registerActivePlatforms:@[
                                      @(SSDKPlatformTypeSinaWeibo),
                                      @(SSDKPlatformTypeCopy),
                                      @(SSDKPlatformTypeWechat),
                                      @(SSDKPlatformTypeQQ),
                                      ]
                           onImport:^(SSDKPlatformType platformType)
   {
     switch (platformType)
     {
       case SSDKPlatformTypeWechat:
         [ShareSDKConnector connectWeChat:[WXApi class]];
         break;
       case SSDKPlatformTypeQQ:
         [ShareSDKConnector connectQQ:[QQApiInterface class] tencentOAuthClass:[TencentOAuth class]];
         break;
       case SSDKPlatformTypeSinaWeibo:
         [ShareSDKConnector connectWeibo:[WeiboSDK class]];
         break;
       default:
         break;
     }
   }
                    onConfiguration:^(SSDKPlatformType platformType, NSMutableDictionary *appInfo)
   {
     switch (platformType)
     {
       case SSDKPlatformTypeSinaWeibo:
         //设置新浪微博应用信息,其中authType设置为使用SSO＋Web形式授权
         [appInfo SSDKSetupSinaWeiboByAppKey:@"307526100"
                                   appSecret:@"9ef2ddb849222d7f11d3bc761d869080"
                                 redirectUri:@"http://www.sharesdk.cn"
                                    authType:SSDKAuthTypeSSO];
         break;
       case SSDKPlatformTypeWechat:
         [appInfo SSDKSetupWeChatByAppId:@"wx4868b35061f87885"
                               appSecret:@"64020361b8ec4c99936c0e3999a9f249"];
         break;
       case SSDKPlatformTypeQQ:
         [appInfo SSDKSetupQQByAppId:@"1106286418"
                              appKey:@"Ik5zgoTfA7SbGR9N"
                            authType:SSDKAuthTypeBoth];
         break;
       default:
         break;
     }
   }];
}

#pragma mark 构造分享参数


#pragma mark 无UI分享
RCT_EXPORT_METHOD(share:(NSInteger)platformType shareParams:(NSDictionary *)shareParams)
{
  NSLog(@"shareParams-->%@",shareParams);
  NSMutableDictionary *content = [NSMutableDictionary dictionary];
  NSString *shareURL = [shareParams objectForKey:@"url"];
  NSString *title = [shareParams objectForKey:@"title"];
  NSString *image = [shareParams objectForKey:@"imageUrl"];
  NSString *text = [shareParams objectForKey:@"text"];
  
  NSURL *url = shareURL? [NSURL URLWithString:shareURL] : nil;
  switch (platformType) {
    case SSDKPlatformTypeSinaWeibo: {
      if (url
          && ![text containsString:shareURL]) {
        // 分享到微博，如果带了 URL 自动附加到文字末尾
        text = [text stringByAppendingFormat:@" %@", url];
      }
      [content SSDKSetupSinaWeiboShareParamsByText:text title:title image:image url:url latitude:0 longitude:0 objectID:nil type:SSDKContentTypeAuto];
      break;
    }
    case SSDKPlatformTypeQQ:
      platformType = SSDKPlatformSubTypeQQFriend;
    case SSDKPlatformSubTypeQZone:
    case SSDKPlatformSubTypeQQFriend: {
      [content SSDKSetupQQParamsByText:text title:title url:url thumbImage:image image:image type:SSDKContentTypeAuto forPlatformSubType:platformType];
      break;
    }
    case SSDKPlatformTypeWechat:
      platformType = SSDKPlatformSubTypeWechatSession;
    case SSDKPlatformSubTypeWechatSession:
    case SSDKPlatformSubTypeWechatTimeline:
    case SSDKPlatformSubTypeWechatFav: {
      [content SSDKSetupWeChatParamsByText:text title:title url:url thumbImage:image image:image musicFileURL:nil extInfo:nil fileData:nil emoticonData:nil type:SSDKContentTypeAuto forPlatformSubType:platformType];
      break;
    }
    default: {
      break;
    }
  }
  
  [ShareSDK share:(SSDKPlatformType)platformType parameters:content onStateChanged:^(SSDKResponseState state, NSDictionary *userData, SSDKContentEntity *contentEntity, NSError *error) {
    switch (state) {
      case SSDKResponseStateFail:
        [self sendEventWithName:@"fail" body:@{@"error":[error description] }];
        break;
        
      case SSDKResponseStateCancel:
        [self sendEventWithName:@"cancel" body:@{@"error": @"取消分享" }];
        break;
        
      case SSDKResponseStateSuccess:
        [self sendEventWithName:@"success" body:@{@"rawdata":[contentEntity rawData] }];
        break;
        
      default:
        break;
    }
  }];
}

#pragma mark 是否存在
RCT_REMAP_METHOD(isClientValid,
                 platformType:(NSInteger)platformType
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  switch (platformType) {
    case SSDKPlatformTypeSinaWeibo:
      resolve([NSNumber numberWithBool:[ShareSDKManager isWeiboEnabled]]);
      break;
    case SSDKPlatformTypeQQ:
    case SSDKPlatformSubTypeQZone:
    case SSDKPlatformSubTypeQQFriend:
      resolve([NSNumber numberWithBool:[ShareSDKManager isQQEnabled]]);
      break;
    case SSDKPlatformTypeWechat:
      resolve([NSNumber numberWithBool:[ShareSDKManager isWeChatEnabled]]);
      break;
    default:
      resolve(@false);
      break;
  }
}

#pragma mark 授权
RCT_EXPORT_METHOD(authorize:(NSInteger)platformType)
{
  [ShareSDK authorize:(SSDKPlatformType)platformType settings:nil onStateChanged:^(SSDKResponseState state, SSDKUser *user, NSError *error) {
    switch (state) {
      case SSDKResponseStateFail:
        // TODO callback 第二个参数为数组，将返回值全部都丢在这个数组中
        //callback(@[[error description]]);
        
        [self sendEventWithName:@"fail" body:@{@"error":[error description] }];
        break;
        
      case SSDKResponseStateCancel:
        [self sendEventWithName:@"cancel" body:@{@"error":@"取消分享" }];
        break;
        
      case SSDKResponseStateSuccess:
        //callback(@[[NSNull null],[contentEntity rawData]]);
        [self sendEventWithName:@"success" body:@{@"rawdata":[user rawData] }];
        
        NSLog(@"success");
        break;
        
      default:
        break;
    }
  }];
}

#pragma mark 检查平台是否已经授权
RCT_EXPORT_METHOD(hasAuthorized:(NSInteger)platformType)
{
  [ShareSDK hasAuthorized:platformType];
}

#pragma mark 取消授权
RCT_EXPORT_METHOD(cancelAuthorize:(NSInteger)platformType)
{
  [ShareSDK cancelAuthorize:(SSDKPlatformType)platformType];
}

#pragma mark 获取用户信息
RCT_EXPORT_METHOD(getUserInfo:(NSInteger)platformType)
{
  [ShareSDK getUserInfo:platformType onStateChanged:^(SSDKResponseState state, SSDKUser *user, NSError *error) {
    switch (state) {
      case SSDKResponseStateFail:
        // TODO callback 第二个参数为数组，将返回值全部都丢在这个数组中
        //callback(@[[error description]]);
        
        [self sendEventWithName:@"fail" body:@{@"error":[error description] }];
        break;
        
      case SSDKResponseStateCancel:
        [self sendEventWithName:@"cancel" body:@{@"error":@"取消分享" }];
        break;
        
      case SSDKResponseStateSuccess:
        //callback(@[[NSNull null],[contentEntity rawData]]);
        [self sendEventWithName:@"success" body:@{@"rawdata":[user rawData] }];
        
        NSLog(@"success");
        break;
        
      default:
        break;
    }
    
  }];
}

+ (BOOL)isQQEnabled {
  static int status = -1;
  if (status < 0) {
    status = ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"mqqapi://"]]);
  }
  return status;
}

+ (BOOL)isWeiboEnabled {
  static int status = -1;
  if (status < 0) {
    status = ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"sinaweibo://"]]);
  }
  if (status < 0) {
    status = ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"weico://"]]);
  }
  return status;
}

+ (BOOL)isWeChatEnabled {
  static int status = -1;
  if (status < 1) {
    status = ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"wechat://"]]);
  }
  if (status < 1) {
    status = ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"weixin://"]]);
  }
  if (status < 1) {
    status = ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"fb290293790992170://"]]);
  }
  return status;
}



@end
