const express = require('express');
const router = express.Router();
const userModel = require('../../model/groupUser/schemaUser');
const roleModel = require('../../model/groupUser/schemaRole');
const permissionModel = require('../../model/groupUser/schemaPermission');
const multer = require('multer');
const fs = require('fs');
const checkAuthentication = require('../../utils/checkAuthentication');
const sgMail = require('@sendgrid/mail')
const faker = require('faker');




const sendMail = (userName, userMail, userPassword) => {
  const API_KEY = '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';
  sgMail.setApiKey(API_KEY);

  const message = {
    to: userMail,
    from: 'ducnin1998@gmail.com',
    subject: 'ANT-CVV Tài Khoản & Mật Khẩu Đăng Nhập ',
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width"><style>/*<![CDATA[*/html, body, a, span, div[style*="margin: 16px 0"]{border:0 !important;margin:0 !important;outline:0 !important;padding:0 !important;text-decoration:none !important}a,span,td,th{-webkit-font-smoothing:antialiased !important;-moz-osx-font-smoothing:grayscale !important}span.st-Delink a{color:#525f7f !important;text-decoration:none !important}span.st-Delink.st-Delink--preheader a{color:white !important;text-decoration:none !important}span.st-Delink.st-Delink--title a{color:#32325d !important;text-decoration:none !important}span.st-Delink.st-Delink--footer a{color:#8898aa !important;text-decoration:none !important}table.st-Header td.st-Header-background div.st-Header-area{height:76px !important;width:600px !important;background-repeat:no-repeat !important;background-size:600px 76px !important}table.st-Header td.st-Header-logo div.st-Header-area{height:21px !important;width:49px !important;background-repeat:no-repeat !important;background-size:49px 21px !important}table.st-Header td.st-Header-logo.st-Header-logo--atlasAzlo div.st-Header-area{height:21px !important;width:216px !important;background-repeat:no-repeat !important;background-size:216px 21px !important}@media (-webkit-min-device-pixel-ratio: 1.25), (min-resolution: 120dpi), all and (max-width: 768px){body[override] div.st-Target.st-Target--mobile img{display:none !important;margin:0 !important;max-height:0 !important;min-height:0 !important;mso-hide:all !important;padding:0 !important;font-size:0 !important;line-height:0 !important}body[override] table.st-Header td.st-Header-background div.st-Header-area{background-image:url('https://stripe-images.s3.amazonaws.com/html_emails/2017-08-21/header/Header-background.png') !important}body[override] table.st-Header.st-Header--white td.st-Header-background div.st-Header-area{background-image:url('https://stripe-images.s3.amazonaws.com/html_emails/2017-08-21/header/Header-background--white.png') !important}body[override] table.st-Header.st-Header--simplified td.st-Header-logo div.st-Header-area{background-image:url('https://stripe-images.s3.amazonaws.com/html_emails/2017-08-21/header/Header-logo.png') !important}body[override] table.st-Header.st-Header--simplified td.st-Header-logo.st-Header-logo--atlasAzlo div.st-Header-area{background-image:url('https://stripe-images.s3.amazonaws.com/html_emails/2018-05-02/header/Header-logo--atlasAzlo.png') !important}}@media all and (max-width: 600px){body[override] table.st-Wrapper, body[override] table.st-Width.st-Width--mobile{min-width:100% !important;width:100% !important}body[override] td.st-Spacer.st-Spacer--gutter{width:32px !important}body[override] td.st-Spacer.st-Spacer--kill{width:0 !important}body[override] td.st-Spacer.st-Spacer--emailEnd{height:32px !important}body[override] td.st-Font.st-Font--title, body[override] td.st-Font.st-Font--title span, body[override] td.st-Font.st-Font--title a{font-size:28px !important;line-height:36px !important}body[override] td.st-Font.st-Font--header, body[override] td.st-Font.st-Font--header span, body[override] td.st-Font.st-Font--header a{font-size:24px !important;line-height:32px !important}body[override] td.st-Font.st-Font--body, body[override] td.st-Font.st-Font--body span, body[override] td.st-Font.st-Font--body a{font-size:18px !important;line-height:28px !important}body[override] td.st-Font.st-Font--caption, body[override] td.st-Font.st-Font--caption span, body[override] td.st-Font.st-Font--caption a{font-size:14px !important;line-height:20px !important}body[override] table.st-Header td.st-Header-background div.st-Header-area{margin:0 auto !important;width:auto !important;background-position:0 0 !important}body[override] table.st-Header td.st-Header-background div.st-Header-area{background-image:url('https://stripe-images.s3.amazonaws.com/html_emails/2017-08-21/header/Header-background--mobile.png') !important}body[override] table.st-Header.st-Header--white td.st-Header-background div.st-Header-area{background-image:url('https://stripe-images.s3.amazonaws.com/html_emails/2017-08-21/header/Header-background--white--mobile.png') !important}body[override] table.st-Header.st-Header--simplified td.st-Header-logo{width:auto !important}body[override] table.st-Header.st-Header--simplified td.st-Header-spacing{width:0 !important}body[override] table.st-Header.st-Header--simplified td.st-Header-logo div.st-Header-area{margin:0 auto !important;background-image:url('https://stripe-images.s3.amazonaws.com/html_emails/2017-08-21/header/Header-logo.png') !important}body[override] table.st-Header.st-Header--simplified td.st-Header-logo.st-Header-logo--atlasAzlo div.st-Header-area{margin:0 auto !important;background-image:url('https://stripe-images.s3.amazonaws.com/html_emails/2018-05-02/header/Header-logo--atlasAzlo.png') !important}body[override] table.st-Divider td.st-Spacer.st-Spacer--gutter, body[override] tr.st-Divider td.st-Spacer.st-Spacer--gutter{background-color:#e6ebf1}body[override] table.st-Blocks table.st-Blocks-inner{border-radius:0 !important}body[override] table.st-Blocks table.st-Blocks-inner table.st-Blocks-item td.st-Blocks-item-cell{display:block !important}body[override] table.st-Button{margin:0 auto !important;width:100% !important}body[override] table.st-Button td.st-Button-area, body[override] table.st-Button td.st-Button-area a.st-Button-link, body[override] table.st-Button td.st-Button-area span.st-Button-internal{height:44px !important;line-height:44px !important;font-size:18px !important;vertical-align:middle !important}}@media (-webkit-min-device-pixel-ratio: 1.25), (min-resolution: 120dpi), all and (max-width: 768px){body[override] div.st-Target.st-Target--mobile img{display:none !important;margin:0 !important;max-height:0 !important;min-height:0 !important;mso-hide:all !important;padding:0 !important;font-size:0 !important;line-height:0 !important}body[override] div.st-Icon.st-Icon--document{background-image:url('https://stripe-images.s3.amazonaws.com/notifications/icons/document--16--regular.png') !important}}/*]]>*/</style></head><body class="st-Email" bgcolor="f6f9fc" style="border: 0; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; min-width: 100%; width: 100%;" override="fix"><table class="st-Background" bgcolor="f6f9fc" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 0; margin: 0; padding: 0;"><tbody><tr><td style="border: 0; margin: 0; padding: 0;"><table class="st-Wrapper" align="center" bgcolor="ffffff" border="0" cellpadding="0" cellspacing="0" width="600" style="border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; margin: 0 auto; min-width: 600px;"><tbody><tr><td style="border: 0; margin: 0; padding: 0;"><table class="st-Header st-Header--simplified st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td class="st-Spacer st-Spacer--divider" colspan="4" height="19" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Header-logo" align="left" height="21" width="49" style="border: 0; margin: 0; padding: 0;"><div class="st-Header-area st-Target st-Target--mobile" style="background-color: #6772e5;"> <a style="border: 0; margin: 0; padding: 0; text-decoration: none;" href="http://cvv.vn/"> <img alt="Stripe" border="0" class="st-Header-source" height="21" width="49" style="border: 0; margin: 0; padding: 0; color: #6772e5; display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; font-size: 12px; font-weight: normal;" src="https://stripe-images.s3.amazonaws.com/html_emails/2017-08-21/header/Header-logo.png"> </a></div></td><td class="st-Header-spacing" width="423" style="border: 0; margin: 0; padding: 0;"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--divider" colspan="4" height="19" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr class="st-Divider"><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; max-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td bgcolor="#e6ebf1" colspan="2" height="1" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; max-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; max-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--divider" colspan="4" height="32" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; max-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr></tbody></table><table class="st-Preheader st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td align="center" height="0" style="border: 0; margin: 0; padding: 0; color: #ffffff; display: none !important; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; mso-hide: all !important; opacity: 0; overflow: hidden; visibility: hidden;"> <span class="st-Delink st-Delink--preheader" style="color: #ffffff; text-decoration: none;"> We’ve received a request to reset the password for the Stripe account associated with ${userMail}. No changes have been made to your account yet. ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ </span></td></tr></tbody></table><table class="st-Copy st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Font st-Font--body" style="border: 0; margin: 0; padding: 0; color: #525F7f !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; font-size: 16px; line-height: 24px;"> Hello ${userName},</td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--stacked" colspan="3" height="12" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr></tbody></table><table class="st-Copy st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Font st-Font--body" style="border: 0; margin: 0; padding: 0; color: #525F7f !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; font-size: 16px; line-height: 24px;"> We’ve received a request to forgot the password for the ANT-CVV account associated with <b>${userMail}</b>.</td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--stacked" colspan="3" height="12" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr></tbody></table><table class="st-Copy st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Font st-Font--body" style="border: 0; margin: 0; padding: 0; color: #525F7f !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; font-size: 16px; line-height: 24px;"> <b>Your current password is:</b></td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--stacked" colspan="3" height="12" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr></tbody></table><table class="st-Copy st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Font st-Font--body" style="border: 0; margin: 0; padding: 0; color: #525F7f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; font-size: 16px; line-height: 24px;"><table class="st-Button st-Button--fullWidth" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td align="center" class="st-Button-area" height="38" valign="middle" style="border: 0; margin: 0; padding: 0; background-color: #666ee8; border-radius: 5px; text-align: center;"> <a class="st-Button-link" style="border: 0; margin: 0; padding: 0; color: #ffffff; display: block; height: 38px; text-align: center; text-decoration: none;" href="#"> <span class="st-Button-internal" style="border: 0; margin: 0; padding: 0; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; font-size: 16px; font-weight: bold; height: 38px; line-height: 38px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: middle; white-space: nowrap; width: 100%;">${userPassword}</span> </a></td></tr></tbody></table></td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--stacked" colspan="3" height="12" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr></tbody></table><table class="st-Copy st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td class="st-Spacer st-Spacer--stacked" colspan="3" height="12" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr></tbody></table><table class="st-Copy st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Font st-Font--body" style="border: 0; margin: 0; padding: 0; color: #525F7f !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; font-size: 16px; line-height: 24px;"> You can find answers to most questions and get in touch with us at <a style="border: 0; margin: 0; padding: 0; color: #556cd6 !important; text-decoration: none;" href="http://cvv.vn/">support.cvv.com</a>. We’re here to help you at any step along the way.</td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--stacked" colspan="3" height="12" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr></tbody></table><table class="st-Copy st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Font st-Font--body" style="border: 0; margin: 0; padding: 0; color: #525F7f !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; font-size: 16px; line-height: 24px;"> <b>— The ANT-CVV team</b></td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--stacked" colspan="3" height="12" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr></tbody></table><table class="st-Footer st-Width st-Width--mobile" border="0" cellpadding="0" cellspacing="0" width="600" style="min-width: 600px;"><tbody><tr><td class="st-Spacer st-Spacer--divider" colspan="3" height="20" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; max-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr class="st-Divider"><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; max-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td bgcolor="#e6ebf1" colspan="2" height="1" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; max-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; max-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--divider" colspan="3" height="31" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td><td class="st-Font st-Font--caption" style="border: 0; margin: 0; padding: 0; color: #8898aa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; font-size: 12px; line-height: 16px;"> <span class="st-Delink st-Delink--footer" style="border: 0; margin: 0; padding: 0; color: #8898aa; text-decoration: none;"> TT7A-1, Urban Dai Kim, Hoang Mai District, Hanoi </span></td><td class="st-Spacer st-Spacer--gutter" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;" width="64"><div class="st-Spacer st-Spacer--filler"></div></td></tr><tr><td class="st-Spacer st-Spacer--emailEnd" colspan="3" height="64" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler"></div></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td class="st-Spacer st-Spacer--emailEnd" height="64" style="border: 0; margin: 0; padding: 0; font-size: 1px; line-height: 1px; mso-line-height-rule: exactly;"><div class="st-Spacer st-Spacer--filler">&nbsp;</div></td></tr></tbody></table></body></html>`
  }

  sgMail.send(message)
    .then(response => console.log('Email sent...!'))
    .catch(error => console.log(error.message))
}



const hasFilter = (param, param2, param3, param4, param5) => {
  if (param !== null && param2 !== null && param3 !== null) {

    return { gender: param, role: param2, active: param3, softDelete: param5 }

  } else if (param == null && param2 !== null && param3 !== null) {

    return { role: param2, active: param3, name: param4, softDelete: param5 }

  } else if (param2 == null && param !== null && param3 !== null) {

    return { gender: param, active: param3, name: param4, softDelete: param5 }

  } else if (param3 == null && param !== null && param2 !== null) {

    return { gender: param, role: param2, name: param4, softDelete: param5 }

  } else if (param == null && param2 == null && param3 !== null) {

    return { active: param3, name: param4, softDelete: param5 }

  } else if (param == null && param3 == null && param2 !== null) {

    return { role: param2, name: param4, softDelete: param5 }

  } else if (param2 == null && param3 == null && param !== null) {

    return { gender: param, name: param4, softDelete: param5 }

  } else {

    return { name: param4, softDelete: param5 }
  }
}


//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

const checkEmail = async (req, res, next) => {
  let email = req.body?.email;
  await userModel.findOne({ email: email })
    .then(data => {
      if (data) {
        return res.status(200).json({
          success: true,
          message: "👋 This email address is already used!"
        });
      } else {
        next();
      }
    })
    .catch(err => {
      console.log(err)
    })
}


const roleDefault = async (req, res, next) => {
  let _id = req.body.idRole;
  await roleModel.findOne({ _id: _id }).select({ _id: 0 })
    .then(data => {
      RoleUser = data;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}


const idUserAuto = async (req, res, next) => {
  await userModel.findOne({}, { idUser: 1, _id: 0 }).sort({ idUser: -1 })
    .then(data => {
      (data == null || data == '' || data == undefined) ? AutoId = 10000 : AutoId = data.idUser + 1;
      next();
    })
    .catch(err => {
      console.log(err)
    })
}



router.get('/list', checkAuthentication, async function (req, res, next) {
  try {

    let gender = req.query.gender;
    let role = req.query.role;
    let active = req.query.active;
    let softDelete = 0;
    let q = req.query.q;
    (gender == undefined || gender == '') ? gender = null : gender = gender;
    (role == undefined || role == '') ? role = null : role = role;
    (active == undefined || active == '') ? active = null : active = active;
    // console.log(gender, role, active, q)

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const users = await userModel
      .find(hasFilter(gender, role, active, regex, softDelete))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


    const totalRecords = await userModel.countDocuments(hasFilter(gender, role, active, regex, softDelete));
    Promise.all([users, totalRecords]).then(([users, totalRecords]) => {
      return res.status(200).json({
        success: true,
        totalRecords: totalRecords,
        users: users,
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* GET Details users listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/user/create
// ? Example: http://localhost:1509/user/create
router.post('/create', checkAuthentication, checkEmail, idUserAuto, roleDefault, async function (req, res, next) {
  try {
    let passwordRan = faker.internet.password();
    const entry = await userModel.create({
      idUser: AutoId,
      name: req.body?.name,
      gender: req.body?.gender,
      birthDay: req.body?.birthDay,
      telephone: req.body?.telephone,
      email: req.body?.email,
      password: req.body?.password,
      active: 0,
      softDelete: 0,
      created: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      },
      modified: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      }
    })
    const entry2 = await permissionModel.create({
      idUser: AutoId,
      nameRole: RoleUser.name,
      modules: RoleUser.modules,
      ability: RoleUser.ability
    })

    sendMail(req.body?.name, req.body?.email, passwordRan)


    return res.status(200).json({
      success: true,
      message: "👋 Create Successfully!"
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* GET Details users listing. */
// TODO: METHOD - GET
// -u http://localhost:1509/mail/task/detail/:id
// ? Example: http://localhost:1509/mail/task/detail/606f591f41340a452c5e8376
router.get('/detail/:idUser', async function (req, res, next) {
  try {
    const idUser = req.params.idUser;
    const entry = await userModel.findOne({ idUser: idUser });
    const entry2 = await permissionModel.findOne({ idUser: idUser }).select({ _id: 0 });
    const userData = { ...entry._doc, role: entry2.name, ability: entry2.ability, modules: entry2.modules };
    return res.status(200).json({
      success: true,
      users: userData,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});



/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/update/:id

router.put('/update/:idUser', checkAuthentication, async function (req, res, next) {
  try {
    let idUser = req.params.idUser;
    let permissionUser = req.body.permission;
    const entry = await userModel.findOneAndUpdate({ idUser: idUser }, {
      $set: {
        name: req.body?.name,
        gender: req.body?.gender,
        birthDay: req.body?.birthDay,
        active: req.body?.active,
        telephone: req.body?.telephone,
        email: req.body?.email,
        password: req.body?.password,
        modified: {
          createBy: `US${userObj.idUser}-${userObj.name}`,
          time: Date.now()
        }
      }
    });

    const entry2 = await permissionModel.findOneAndUpdate({ idUser: idUser }, {
      $set: {
        name: permissionUser.name,
        modules: permissionUser.modules,
        ability: permissionUser.ability,
      }
    })

    return res.status(200).json({
      success: true,
      message: "Update Successfully!"
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/active/:id

router.patch('/active/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await userModel.findByIdAndUpdate({ _id: _id }, {
      active: req.body?.active,
      modified: {
        createBy: `US${userObj.idUser}-${userObj.name}`,
        time: Date.now()
      }
    });
    return res.status(200).json({
      success: true,
      message: "Change Status Successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/upload/:id

router.post('/upload/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;

    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, './public/upload/users');
      },
      filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
      }
    });

    const upload = multer({ storage: storage }).any('file');

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      let results = req.files.map(async (file) => {
        const user = await userModel.findOne({ _id: _id });
        var filePath = user.avatar;

        if (filePath) {
          if (fs.existsSync('./public/' + filePath)) {
            fs.unlinkSync('./public/' + filePath);
          }
        }

        const entry = await userModel.findByIdAndUpdate({ _id: _id }, {
          avatar: `upload/users/${file.filename}`,
          modified: {
            createBy: `US${userObj.idUser}-${userObj.name}`,
            time: Date.now()
          }
        });

        return res.status(200).json({
          success: true,
          data: `upload/users/${file.filename}`,
          message: "Update Avatar Successfully!"
        });
      });

    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - DELETE
// -u http://localhost:1509/user/delete-soft/:id
router.delete('/delete-soft/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;
    const entry = await userModel.updateOne({ _id: _id }, { softDelete: 1, active: 1 });
    return res.status(200).json({
      success: true,
      message: "Delete-Soft Successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});

/* DELETE todo listing deleteSoft Record */
// TODO: METHOD - DELETE
// -u http://localhost:1509/user/delete/:id
router.delete('/delete/:idUser', checkAuthentication, async function (req, res, next) {
  try {
    const idUser = req.params.idUser;
    const entry = await userModel.findOneAndDelete({ idUser: idUser });
    const entry2 = await permissionModel.findOneAndDelete({ idUser: idUser });

    return res.status(200).json({
      success: true,
      message: "Delete Successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


router.get('/list/trash', checkAuthentication, async function (req, res, next) {
  try {
    let gender = req.query.gender;
    let role = req.query.role;
    let active = req.query.active;
    let softDelete = 1;
    let q = req.query.q;
    (gender == undefined || gender == '') ? gender = null : gender = gender;
    (role == undefined || role == '') ? role = null : role = role;
    (active == undefined || active == '') ? active = null : active = active;

    let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

    //? Begin config Pagination
    let pagination = {
      currentPage: parseInt(req.query.page),
      totalItemsPerPage: parseInt(req.query.perPage)
    }

    const users = await userModel
      .find(hasFilter(gender, role, active, regex, softDelete))
      .limit(pagination.totalItemsPerPage)
      .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


    const totalRecords = await userModel.countDocuments(hasFilter(gender, role, active, regex, softDelete));
    Promise.all([users, totalRecords]).then(([users, totalRecords]) => {
      return res.status(200).json({
        success: true,
        totalRecords: totalRecords,
        users: users,
      });
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});


/* PATCH todo listing change isStarred isComplete. */
// TODO: METHOD - PATCH
// -u http://localhost:1509/active/:id

router.patch('/trash/restore/:id', checkAuthentication, async function (req, res, next) {
  try {
    const _id = req.params.id;

    const entry = await userModel.findOneAndUpdate({ _id: _id }, {
      softDelete: 0
    });
    return res.status(200).json({
      success: true,
      message: "Restore Successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  };
});





//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
