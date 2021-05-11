const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail')
const servicesModel = require('../model/schemaService');
const customerModel = require('../model/customer/customer/schemaCustomer');
const groupVoucherModel = require('../model/vouchers/groupVoucher/schemaGroupVoucher');
const voucherItemsModel = require('../model/vouchers/groupVoucher/schemaGroupVoucherItems');
const client = require('twilio')("AC80ed1b888d269dc287173c2202ec9ace", "2a94e9d362710c2a2aa3a51654ff22d8");
var moment = require('moment'); // require






//! FIlter 

const hasFilter = (param, param2, param3, param4) => {
    if (param !== null && param2 !== null) {
        return { typeServices: parseInt(param), statusSend: param2, titleServices: param3, softDelete: param4 }
    }
    else if (param == null && param2 !== null) {
        return { statusSend: param2, titleServices: param3, softDelete: param4 }
    }
    else if (param !== null && param2 == null) {
        return { typeServices: parseInt(param), titleServices: param3, softDelete: param4 }
    }
    else {
        return { titleServices: param3, softDelete: param4 }
    }
}

//! CODE API FOR PERMISSION SUPER ADMIN - ADMIN

const idServicesAuto = async (req, res, next) => {
    await servicesModel.findOne({}, { idServices: 1, _id: 0 }).sort({ idServices: -1 })
        .then(data => {
            (data == null || data == '' || data == undefined) ? AutoId = 10000 : AutoId = data.idServices + 1;
            next();
        })
        .catch(err => {
            console.log(err)
        })
}


const sendSms = async (telephoneCustomer, content, titleServices, nameCustomer, voucherCode, discountVoucher, timeLine, shopApply) => {

    let contentSms = content.replace(/(<([^>]+)>)/ig, '')
    let swapTelephone = telephoneCustomer.replace(/0/i, '+84');
    let arrayListShop = [];
    let listItem = ``;
    let discount = ``;
    let shopApplyItems = shopApply.filter(function (hero) {
        arrayListShop.push(hero.title);
    });
    for (let index = 0; index < arrayListShop.length; ++index) {
        listItem += `${index + 1}-${arrayListShop[index]} `;
    }
    if ((discountVoucher.reduction.money) == null) {
        discount = `Mã giảm giá ${discountVoucher.PercentAMaximum.percent}% cho toàn bộ sản phẩm và giảm tối đa ${(discountVoucher.PercentAMaximum.maximumMoney).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} `;
    } else {
        discount = `Mã giảm giá ${a.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} áp dụng cho toàn sản phẩm của cửa hàng.`;
    }



    await client.messages.create({
        // to: swapTelephone,
        // body: content
        from: "+15708730303",
        to: swapTelephone,
        body: `Sự kiện ${titleServices} của CVV-ANT. Xin chào ${nameCustomer}, ${contentSms}, Mã giảm giá là: ${voucherCode}, chi tiết áp dụng: ${discount}, thời hạn sử dụng của voucher từ ngày ${moment(timeLine.release).format("DD-MM-YYYY")} đến ngày ${moment(timeLine.expiration).format("DD-MM-YYYY")}.Lưu ý danh sách các cửa hàng áp dụng khuyến mãi là: ${listItem}. ANT - CVV xin cảm ơn quý khách đã tin dùng dịch vụ của chúng tôi!`,
    }).then(message => {
        console.log(message.sid);

    }).catch(err => {
        console.log(err);
    })

}

const sendMail = (to, subject, nameCustomer, voucherCode, discountVoucher, timeLine, shopApply) => {
    const API_KEY = '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';
    sgMail.setApiKey(API_KEY);

    const message = {
        to: to,
        from: 'ducnin1998@gmail.com',
        subject: subject,
        html: `
        < !DOCTYPE html >
            <html lang="en" >

                <head>
                    <meta charset="UTF-8">
                        <title>A Gift For You: Happy Birthday</title>





</head>

                    <body>
                        <!DOCTYPE html>
<html lang="en" >

                            <head>
                                <meta charset="UTF-8">
                                    <title>A Gift For You: Happy Birthday, Smiles Davis</title>





</head>

                                <body>

                                    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                                        <head>
                                            <title>Runtastic</title>
                                            <meta name="viewport" content="initial-scale=1, user-scalable=yes">
                                                <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]-->
<style type="text/css">
                                                    .la1 a {font - weight:normal; text-decoration:none; color:#2b2c2c;}

@media only screen and (max-width:414px) {
.fl {display:block !important; width:100% !important; }
.fw {width:100% !important; min-width:0 !important; }
.sec {width:100% !important; float:none !important; }
.mh, .mobile_hidden {display:none !important; }
.image {width:100% !important; height:auto !important; }
.comt {margin:0 auto !important; }
.com {text - align:center; }
.lom {text - align:left; }
font {font - size:16px !important; font-size:5vw !important; }
.h1, .h1 font {font - size:35px !important; font-size:10.9375vw !important; }
.h2, .h2 font {font - size:30px !important; font-size:9.375vw !important; }
.h3, .h3 font {font - size:18px !important; font-size:5.625vw !important; }
.small, .small font {font - size:15px !important; font-size:4.6875vw !important; }
.xsmall, .xsmall font {font - size:13px !important; font-size:4.0625vw !important; }
.xxsmall, .xxsmall font {font - size:12px !important; font-size:3.75vw !important; }
.lh, .lh font {line - height:normal !important; }
.mcta {padding:10px 5px !important; padding:3.125vw 5px !important; -moz-border-radius:25px !important; -webkit-border-radius:25px !important; border-radius:25px !important; -moz-border-radius:7.8125vw !important; -webkit-border-radius:7.8125vw !important; border-radius:7.8125vw !important; }
.cta3a, .cta3a td {background:none !important; -moz-border-radius:0 !important; -webkit-border-radius:0 !important; border-radius:0 !important; padding:0 !important; }
.cta3a a {-moz - border - radius:25px; -webkit-border-radius:25px; border-radius:25px; padding:10px 5px; -moz-border-radius:7.8125vw; -webkit-border-radius:7.8125vw; border-radius:7.8125vw; padding:3.125vw 5px; }
.rwom {width:auto !important; }
.rhom {height:auto !important; }
.rw10, .rw10 img {width:10px !important; }
.rw30, .rw30 img {width:30px !important; }
.rh1, .rh1 img {height:1px !important; }
.rh5, .rh5 img {height:5px !important; height:1.5625vw !important; }
.rh10, .rh10 img {height:10px !important; height:3.125vw !important; }
.rh15, .rh15 img {height:15px !important; height:4.6875vw !important; }
.rh20, .rh20 img {height:20px !important; height:6.25vw !important; }
.rh50, .rh50 img {height:50px !important; height:15.625vw !important; }
.rh60, .rh60 img {height:60px !important; height:18.75vw !important; }
.rh70, .rh70 img {height:70px !important; height:21.875vw !important; }
.rh80, .rh80 img {height:80px !important; height:25vw !important; }
.mtop10 {margin - top:10px; margin-top:3.125vw; }
.mbot10 {margin - bottom:10px; margin-bottom:3.125vw; }
.mbot40 {margin - bottom:40px; margin-bottom:12.5vw; }
.mbot50 {margin - bottom:50px; margin-bottom:15.625vw; }
.mtop5 {margin - top:5px; margin-top:1.5625vw; }
.plr10 {padding:0 10px; }
.ptb10 {padding:10px 0; }
.pbot10 {padding - bottom:10px; padding-bottom:3.125vw; }
.pbot5 {padding - bottom:10px; padding-bottom:1.5625vw; }
.sm1 {margin - bottom:10px !important; margin-bottom:3.125vw !important; }
.break {display:block !important; }
.nobg {background:none !important; }
.cntbg {background - size:cover !important; background-position:center !important;}
u + .body .gwfw {width:100% !important; width:100vw !important; }

}

<!--
body {margin:0; padding:0; background:#eeeff1; -webkit-text-size-adjust:none; -ms-text-size-adjust:none; }
a, a:active, a:visited, .yshortcuts, .yshortcuts a span {color:#007aff; text-decoration:underline; font-weight:normal; }
a[x-apple-data-detectors] {color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
td div, button {display:block !important; }
.ReadMsgBody {width:100%; }
.ExternalClass *, .b-message-body {line - height:100%; }
.ExternalClass {width:100%; }
input {display:none !important; max-height:0px; overflow:hidden; }
table th {padding:0; Margin:0; border:0; font-weight:normal; vertical-align:top; }
*[lang="uri"] a {color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important; }
-->
</style>
                                                <!--[if gte mso 9]>
<style type="text/css">
                                                    table {border - collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; border:0; }
table td, table th {border - collapse:collapse; font-size:1px; line-height:1px; }
.lh {line - height:normal !important; }
.olcta3td {padding:0 !important; }
.olcta4td {padding:8px 5px !important; }
.ol26 {width:26px !important; }
.olcta3a {width:198px !important; }
</style>
                                                <xml>
                                                    <o:OfficeDocumentSettings>
                                                        <o:AllowPNG />
                                                        <o:PixelsPerInch>96</o:PixelsPerInch>
                                                    </o:OfficeDocumentSettings>
                                                </xml>
                                                <![endif]-->
<!--[if (gte mso 9)|(IE)]>
<style type="text/css">
                                                    .olcta {padding:0 !important; background-color:none !important; background-image:none !important; background:none !important; border:none !important; -moz-border-radius:0 !important; -webkit-border-radius:0 !important; border-radius:0 !important; }
.oltd {padding:17px 0; line-height:normal !important; }
.olb {display:block !important; }
.olbg007aff {background - color:#007aff; }
.olbg5ed75e {background - color:#5ed75e; }
.olbgffffff {background - color:#ffffff; }
</style>
                                                <![endif]-->
</head>
                                            <body class="body">
                                                <div style="display:none; width:0px; height:0px; max-width:0px; max-height:0px; overflow:hidden; mso-hide:all;"><font face="Helvetica, Arial, sans-serif" style="font-size:0px; line-height:0px; color:#eeeff1;">It’s your birthday, yay! Of course, we have to celebrate with a special gift exclusively for you on your special day. We are so thankful that you are a part of the Runtastic community and we cannot DISCOUNT your loyalty and hard work. Hurry, open up &amp; get your birthday present today!<br> </font></div>
                                                    <div class="yfix">
                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#eeeff1" class="gwfw">
                                                            <tr>
                                                                <td width="100%" align="center">
                                                                    <table cellspacing="0" cellpadding="0" border="0" width="600" class="fw">
                                                                        <tr>
                                                                            <td height="15" class="rh5"><img src="http://link.runtastic.com/img/trans.gif" width="1" height="15" style="display:block;"></td>
</tr>
                                                                            <tr>
                                                                                <td height="1"><img src="http://link.runtastic.com/mo/DsBAbJwFVX_645781705_1432009_14276_682127.gif" height="1" style="display:block;"></td>
</tr>
</table>
</td>
</tr>
                                                                    <tr>
                                                                        <td align="center">
                                                                            <table cellspacing="0" cellpadding="0" border="0" width="600" bgcolor="#ffffff" class="fw">
                                                                                <tr class="sectiongroup_4312 is_mobile_hideable">
                                                                                    <td><table border="0" cellspacing="0" cellpadding="0" bgcolor="#007aff" width="100%">
                                                                                        <tr>
                                                                                            <td align="center" style="padding:15px 0;"><a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_2_64&ems_l=682127" target="_blank"><img src="http://link.runtastic.com/templates/run6en/img/logo6.png" width="165" border="0" style="display:block;"></a></td>
</tr>
</table></td>
</tr><tr class="sectiongroup_4314 is_mobile_hideable">
                                                                                        <td><table cellpadding="0" cellspacing="0" border="0" width="100%" class="is_image_mobile_hideable">
                                                                                            <tr>
                                                                                                <td align="center"><a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_3_2&ems_l=682127&d=SEFQUFlCRC1DQ1hULVpBV1Y%3D%7C" target="_blank" e:section-id="3"><img width="600" id="section_image_3" src="http://link.runtastic.com/custloads/645781705/md_5725.gif" border="0" style="display:block;" class="image" alt="Your Gift" title="Your Gift"></a></td>
</tr>
</table></td>
</tr><tr class="sectiongroup_4321 is_mobile_hideable">
                                                                                            <td><table width="100%" cellspacing="0" cellpadding="0" border="0">
                                                                                                <tbody><tr>
                                                                                                    <td valign="middle" height="245" bgcolor="#d7eaff">
                                                                                                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                                                                                            <tbody><tr>
                                                                                                                <td colspan="3" class="rh10" height="5"><img src="http://link.runtastic.com/img/trans.gif" style="display: block;" width="1" height="5" /></td>
                                                                                                            </tr>
                                                                                                                <tr>
                                                                                                                    <td class="rhom" width="30" height="235"><img src="http://link.runtastic.com/img/trans.gif" style="display: block;" width="1" height="225" /></td>
                                                                                                                    <td>
                                                                                                                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                                                                                                            <tbody><tr>
                                                                                                                                <td class="h2" align="center"><font style="font-size: 40px; color: rgb(0, 51, 102); text-decoration: none; font-weight: normal;" face="Helvetica, Verdana, sans-serif">​Happy Birthday,<br />Smiles Davis!</font></td>
                                                                                                                            </tr>
                                                                                                                                <tr>
                                                                                                                                    <td height="10"><img src="http://link.runtastic.com/img/trans.gif" style="display: block;" width="1" height="10" /></td>
                                                                                                                                </tr>
                                                                                                                                <tr>
                                                                                                                                    <td align="center"><font style="font-size: 14px; line-height: 24px; color: rgb(0, 51, 102);" face="Helvetica, Verdana, sans-serif"><div style="text-align: center;"><span style="color: rgb(0, 51, 102);"><br />We didn’t want to get you just one gift, so we got you all the gifts! Grab your <b>50% discount on Premium</b> to unlock every single feature in every Runtastic app. Now you’ve got everything you need to reach your health and fitness goals. Have a look below for a sneak peak of what’s included in your Premium present!</span></div> </font></td>
                                                                                                                                </tr>
                                                                                                                            </tbody></table>
                                                                                                                    </td>
                                                                                                                    <td width="30"><br /></td>
                                                                                                                </tr>
                                                                                                                <tr>
                                                                                                                    <td colspan="3" class="rh10" height="5"><img src="http://link.runtastic.com/img/trans.gif" style="display: block;" width="1" height="5" /></td>
                                                                                                                </tr>
                                                                                                            </tbody></table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                </tbody></table></td>
                                                                                        </tr><tr class="sectiongroup_4332 is_mobile_hideable">
                                                                                            <td><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#d7eaff">
                                                                                                <tbody><tr>
                                                                                                    <td>
                                                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                                                            <tbody><tr>
                                                                                                                <td width="30"><img height="1" width="30" src="http://link.runtastic.com/img/trans.gif" /></td>
                                                                                                                <td align="center">
                                                                                                                    <table class="olbg007aff fw" style="direction: ltr;" dir="ltr" width="250" border="0" cellspacing="0" cellpadding="0">
                                                                                                                        <tbody><tr>
                                                                                                                            <!--[if (gte mso 9)|(IE)]>
<td width="26" align="left" valign="top" style="display:none;" class="olb"><img src="http://link.runtastic.com/templates/run6en/i/lt.png" width="26" height="26"></td>
                                                                                                                                <td rowspan="2" valign="middle" style="vertical-align:middle;">
                                                                                                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                                                                                                        <tr>
                                                                                                                                            <![endif]-->
<td class="oltd" align="center"><a class="olcta mcta" style="color: rgb(255, 255, 255); font-weight: normal; text-decoration: none; background-color: rgb(0, 122, 255); border-radius: 26px; padding: 16px 26px; display: block;" target="_blank" href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_11_55&ems_l=682127&d=SEFQUFlCRC1DQ1hULVpBV1Y%3D%7C"><font style="font-size: 15px; color: rgb(255, 255, 255); text-transform: uppercase;" face="Helvetica, Arial, sans-serif"><b>Get My Gift</b></font></a></td>
                                                                                                                                            <!--[if (gte mso 9)|(IE)]>
</tr>
                                                                                                                                    </table>
                                                                                                                                </td>	<td width="26" align="right" valign="top" style="display:none;" class="olb"><img src="http://link.runtastic.com/templates/run6en/i/rt.png" width="26" height="26"></td>
                                                                                                                                    <![endif]-->
</tr>
                                                                                                                                <!--[if (gte mso 9)|(IE)]>
<tr style="display:none;" class="olb">
                                                                                                                                    <td align="left" valign="bottom"><img src="http://link.runtastic.com/templates/run6en/i/lb.png" width="26" height="26"></td>
                                                                                                                                        <td align="right" valign="bottom"><img src="http://link.runtastic.com/templates/run6en/i/rb.png" width="26" height="26"></td>
</tr>
                                                                                                                                        <![endif]-->
</tbody></table>
                                                                                                                            </td>
                                                                                                                            <td width="30"><img height="1" width="30" src="http://link.runtastic.com/img/trans.gif" /></td>
                                                                                                                        </tr>
                                                                                                                        </tbody></table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                                <tr>
                                                                                                                    <td class="rh60" height="30"><img style="display: block;" height="30" width="1" src="http://link.runtastic.com/img/trans.gif" /></td>
                                                                                                                </tr>
                                                                                                            </tbody></table></td>
                                                                                                </tr><tr class="sectiongroup_4351 is_mobile_hideable">
                                                                                                        <td><table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                                                                            <tr>
                                                                                                                <td height="10" bgcolor="#eeeff1"><img src="http://link.runtastic.com/img/trans.gif" width="1" height="10" style="display:block;"></td>
</tr>
</table></td>
</tr>
</table>
</td>
</tr>
                                                                                                <tr>
                                                                                                    <td align="center">
                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="600" bgcolor="#eeeff1" class="fw">
                                                                                                            <tr>
                                                                                                                <td height="27"><img src="http://link.runtastic.com/img/trans.gif" width="1" height="27" style="display:block;"></td>
</tr>
                                                                                                                <tr class="sectiongroup_4409 is_mobile_hideable">
                                                                                                                    <td><table cellpadding="0" cellspacing="0" border="0" bgcolor="#eeeff1" width="100%">
                                                                                                                        <tr>	<td align="center" style="line-height:20px;" class="lh xxsmall"><font face="Helvetica, Arial, sans-serif" style="font-size:12px; line-height:20px; color:#5f646d;">Let's get in touch:</font></td>	</tr>	<tr>	<td height="15"><img src="http://link.runtastic.com/img/trans.gif" width="1" height="15" style="display:block;"></td>	</tr>	<tr>	<td align="center">	<table cellspacing="0" cellpadding="0" border="0">	<tr>	<td width="32"><a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_6_65&ems_l=682127" target="_blank"><img src="http://link.runtastic.com/templates/run6en/i/fb.png" width="32" height="32" border="0" style="display:block;"></a></td>	<td width="10"><img src="http://link.runtastic.com/img/trans.gif" width="10" height="1"></td>	<td width="32"><a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_6_66&ems_l=682127" target="_blank"><img src="http://link.runtastic.com/templates/run6en/i/gp.png" width="32" height="32" border="0" style="display:block;"></a></td>	<td width="10"><img src="http://link.runtastic.com/img/trans.gif" width="10" height="1"></td>	<td width="32"><a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_6_67&ems_l=682127" target="_blank"><img src="http://link.runtastic.com/templates/run6en/i/tw.png" width="32" height="32" border="0" style="display:block;"></a></td>	<td width="10"><img src="http://link.runtastic.com/img/trans.gif" width="10" height="1"></td>	<td width="32"><a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_6_68&ems_l=682127" target="_blank"><img src="http://link.runtastic.com/templates/run6en/i/yt.png" width="32" height="32" border="0" style="display:block;"></a></td>	<td width="10"><img src="http://link.runtastic.com/img/trans.gif" width="10" height="1"></td>	<td width="32"><a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_6_69&ems_l=682127" target="_blank"><img src="http://link.runtastic.com/templates/run6en/i/inst.png" width="32" height="32" border="0" style="display:block;"></a></td>	<td width="10"><img src="http://link.runtastic.com/img/trans.gif" width="10" height="1"></td>	<td width="32"><a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_6_70&ems_l=682127" target="_blank"><img src="http://link.runtastic.com/templates/run6en/i/b.png" width="32" height="32" border="0" style="display:block;"></a></td>	</tr>	</table>	</td>	</tr>	<tr>	<td height="15"><img src="http://link.runtastic.com/img/trans.gif" width="1" height="15" style="display:block;"></td>	</tr>
</table></td>
</tr>
                                                                                                                            <tr>	<td align="center" style="line-height:20px;" class="lh xxsmall"><font face="Helvetica, Arial, sans-serif" style="font-size:12px; line-height:20px; color:#2b2c2c;"><a href="#" target="_blank" style="color:#2b2c2c; font-weight:normal; text-decoration:none;"><font style="color:#2b2c2c;"><u>Unsubscribe</u></font></a> | <a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_-1_56&ems_l=682127" target="_blank" style="color:#2b2c2c; font-weight:normal; text-decoration:none;"><font style="color:#2b2c2c;"><u>Legal</u></font></a> | <a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_-1_57&ems_l=682127" target="_blank" style="color:#2b2c2c; font-weight:normal; text-decoration:none;"><font style="color:#2b2c2c;"><u>Privacy Policy</u></font></a><span class="mh"> | </span><span class="break mtop5"><a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_-1_58&ems_l=682127" target="_blank" style="color:#2b2c2c; font-weight:normal; text-decoration:none;"><font style="color:#2b2c2c;"><u>runtastic GmbH</u></font></a> | <a href="http://link.runtastic.com/u/nrd.php?p=DsBAbJwFVX_14276_1432009_-1_59&ems_l=682127" target="_blank" style="color:#2b2c2c; font-weight:normal; text-decoration:none;"><font style="color:#2b2c2c;"><u>Help and Support</u></font></a></span></font></td>	</tr>
                                                                                                                            <tr>	<td height="10"><img src="http://link.runtastic.com/img/trans.gif" width="1" height="10" style="display:block;"></td>	</tr>	<tr>	<td align="center" style="line-height:20px;" lang="uri" class="lh la1 xxsmall"><font face="Helvetica, Arial, sans-serif" style="font-size:12px; line-height:20px; color:#2b2c2c;">&copy; runtastic GmbH 2018,<br class="mh"><span class="break mtop5">Plu&#173;ska&#173;ufs&#173;tra&#173;ße 7 · Business Center, </span><span class="break mtop5">4&#173;06&#173;1 Pa&#173;sc&#173;hi&#173;ng bei L&#173;in&#173;z, A&#173;ust&#173;ri&#173;a</span><br class="mh"><span class="break mtop5">FN 33&#173;43&#173;97&#173;k | ATU 65&#173;19&#173;72&#173;99</span></font></td>	</tr>
                                                                                                                                <tr>
                                                                                                                                    <td height="20"><img src="http://link.runtastic.com/img/trans.gif" width="1" height="20" style="display:block;"></td>
</tr>
</table>
                                                                                                                            </td>
                                                                                                                            </tr>
</table>
                                                                                                                            <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;" class="mh">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
</div>
</body>
</html>



</body>

</html>

`
    }
    sgMail.send(message)
        .then(response => console.log('Email sent...!'))
        .catch(error => console.log(error.message))
}


const checkIdCustomer = async (req, res, next) => {
    let idCustomer = req.body.idCustomer;
    const entry = await customerModel.findOne({ idCustomer: idCustomer })
        .select({ idCustomer: 1, telephone: 1, email: 1, name: 1 }).then(data => {
            dataCustomer = data;
            next();

        }).catch(err => {
            return err
        })
}

const checkIdGroupVoucher = async (req, res, next) => {
    let idGroupVoucher = req.body.idGroupVoucher;
    const entry = await groupVoucherModel.findOne({ idGroupVoucher: idGroupVoucher })
        .select({ idGroupVoucher: 1, title: 1, listShop: 1 }).then(data => {
            dataGroupVoucher = data;
            next();
        }).catch(err => {
            return err
        })
}


const checkVoucherItems = async (req, res, next) => {
    let idGroupVoucher = req.body.idGroupVoucher;
    let voucherCode = req.body.voucherCode;
    const entry = await voucherItemsModel.findOne({ idGroupVoucher: idGroupVoucher, voucherCode: voucherCode }).then(data => {
        infoVoucherCode = data;
        next();
    }).catch(err => {
        return err
    })
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10 && hours > 0) ? "0" + hours : hours;
    minutes = (minutes < 10 && minutes > 0) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return `${hours} hours, ${minutes} minutes.`;
}
// !SELECT DATA

router.get('/list/customer', async function (req, res, next) {
    try {
        const customers = await customerModel.find({ softDelete: 0 }).select({ "idCustomer": 1, "name": 1, "telephone": 1, "email": 1, "avatar": 1 });
        return res.status(200).json({
            success: true,
            customers: customers,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});

router.get('/list/group-voucher', async function (req, res, next) {
    try {
        const groupVoucher = await groupVoucherModel
            .find({ status: 1, softDelete: 0 })
            .select({ "created": 0, "modified": 0, "softDelete": 0 });

        return res.status(200).json({
            success: true,
            groupVoucher: groupVoucher,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});



router.get('/list/group-voucher/voucher-items/:idGroupVoucher', async function (req, res, next) {
    try {
        let idGroupVoucher = req.params.idGroupVoucher;
        const voucherItems = await voucherItemsModel
            .find({ idGroupVoucher: idGroupVoucher, status: 0, softDelete: 0 })
            .select({ "created": 0, "modified": 0, "softDelete": 0 });

        return res.status(200).json({
            success: true,
            voucherItems: voucherItems,
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
// -u http://localhost:1509/user/create
// ? Example: http://localhost:1509/user/create
router.post('/create', idServicesAuto, checkIdCustomer, checkIdGroupVoucher, checkVoucherItems, async function (req, res, next) {
    try {
        let typeServices = req.body.typeServices;
        let dateAutomaticallySent = req.body.dateAutomaticallySent;
        let titleServices = req.body.titleServices;
        let content = req.body.content;
        let date = dateAutomaticallySent - (Date.now());



        const data = {
            idServices: AutoId,
            idCustomer: dataCustomer.idCustomer,
            idVoucher: infoVoucherCode.idVoucher,
            titleServices: titleServices,
            listShop: dataGroupVoucher.listShop,
            nameCustomer: dataCustomer.name,
            telephoneCustomer: dataCustomer.telephone,
            mailCustomer: dataCustomer.email,
            voucherCode: infoVoucherCode.voucherCode,
            typeServices: typeServices,
            content: content,
            dateAutomaticallySent: dateAutomaticallySent,
            discount: infoVoucherCode.discount,
            timeLine: infoVoucherCode.timeLine,
            details: {
                createBy: "Admin",
                time: Date.now()
            },
            statusSend: 0,
            softDelete: 0
        }

        const serviceCreate = await servicesModel.create(data);
        const updateVoucherItem = await voucherItemsModel.findOneAndUpdate({ idVoucher: infoVoucherCode.idVoucher, softDelete: 0 }, { status: 3, idCustomersUse: dataCustomer.idCustomer, nameCustomerUse: dataCustomer.name });
        if (typeServices == 2) {
            sendMail(dataCustomer.email, titleServices, dataCustomer.name, infoVoucherCode.voucherCode, infoVoucherCode.discount, infoVoucherCode.timeLine, dataGroupVoucher.listShop);
            sendSms(dataCustomer.telephone, content, titleServices, dataCustomer.name, infoVoucherCode.voucherCode, infoVoucherCode.discount, infoVoucherCode.timeLine, dataGroupVoucher.listShop);
        } else if (typeServices == 1) {
            sendMail(dataCustomer.email, titleServices, dataCustomer.name, infoVoucherCode.voucherCode, infoVoucherCode.discount, infoVoucherCode.timeLine, dataGroupVoucher.listShop);
        } else {
            sendSms(dataCustomer.telephone, content, titleServices, dataCustomer.name, infoVoucherCode.voucherCode, infoVoucherCode.discount, infoVoucherCode.timeLine, dataGroupVoucher.listShop);
        }

        return res.status(200).json({
            success: true,
            message: "Create Successfully",
            details: `@ISC${AutoId} will be sent automatically after: ${msToTime(date)} `

        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    };
});






router.get('/list', async function (req, res, next) {
    try {
        let type = req.query.type;
        let status = req.query.status;
        let softDelete = 0;
        let q = req.query.q;
        (type == undefined || type == '') ? type = null : type = type;
        (status == undefined || status == '') ? status = null : status = status;
        let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive
        //? Begin config Pagination
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }

        const services = await servicesModel
            .find(hasFilter(type, status, regex, softDelete))
            .select({ idServices: 1, idCustomer: 1, nameCustomer: 1, titleServices: 1, voucherCode: 1, typeServices: 1, dateAutomaticallySent: 1, statusSend: 1 })
            .limit(pagination.totalItemsPerPage)
            .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


        const totalRecords = await servicesModel.countDocuments(hasFilter(type, status, regex, softDelete));
        Promise.all([services, totalRecords]).then(([services, totalRecords]) => {
            return res.status(200).json({
                success: true,
                totalRecords: totalRecords,
                services: services,
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

router.get('/list/trash', async function (req, res, next) {
    try {
        let type = req.query.type;
        let status = req.query.status;
        let softDelete = 1;
        let q = req.query.q;
        (type == undefined || type == '') ? type = null : type = type;
        (status == undefined || status == '') ? status = null : status = status;
        let regex = new RegExp(q, 'i');  // 'i' makes it case insensitive

        //? Begin config Pagination
        let pagination = {
            currentPage: parseInt(req.query.page),
            totalItemsPerPage: parseInt(req.query.perPage)
        }

        const services = await servicesModel
            .find(hasFilter(type, status, regex, softDelete))
            .select({ idServices: 1, idCustomer: 1, nameCustomer: 1, titleServices: 1, voucherCode: 1, typeServices: 1, dateAutomaticallySent: 1, statusSend: 1 })

            .limit(pagination.totalItemsPerPage)
            .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage);


        const totalRecords = await servicesModel.countDocuments(hasFilter(type, status, regex, softDelete));
        Promise.all([services, totalRecords]).then(([services, totalRecords]) => {
            return res.status(200).json({
                success: true,
                totalRecords: totalRecords,
                services: services,
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
// -u http://localhost:1509/services/sms/detail/:id
// ? Example: http://localhost:1509/services/sms/detail/606f591f41340a452c5e8376
router.get('/detail/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        await servicesModel
            .findOne({ _id: _id })
            .then(data => {
                return res.status(200).json({
                    success: true,
                    data: data
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
// -u http://localhost:1509/services/sms/delete-soft/:id
router.delete('/delete-soft/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await servicesModel.updateOne({ _id: _id }, { softDelete: 1 });
        return res.status(200).json({
            success: true,
            message: "Delete-Soft Successfully"
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
// -u http://localhost:1509/services/sms/delete/:id
router.delete('/delete/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;
        const entry = await servicesModel.findByIdAndDelete({ _id: _id });
        return res.status(200).json({
            success: true,
            message: "Delete Successfully"
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
// -u http://localhost:1509/services/sms/trash/restore/:id

router.patch('/trash/restore/:id', async function (req, res, next) {
    try {
        const _id = req.params.id;

        const entry = await servicesModel.findOneAndUpdate({ _id: _id }, {
            softDelete: 0,
        });
        return res.status(200).json({
            success: true,
            message: "Restore Successfully"
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
// -u http://localhost:1509/delete/many/voucher

router.patch('/delete-soft/many/services', async function (req, res, next) {
    try {
        let obj = req.body.ServicesIdArray;
        const entry = await servicesModel.updateMany({ _id: { $in: obj } }, {
            softDelete: 1
        }, (err, result) => {
            return res.status(200).json({
                success: true,
                message: "Delete-Soft Successfully"
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
// -u http://localhost:1509/delete/many/voucher

router.patch('/trash/restore/many/services', async function (req, res, next) {
    try {
        let obj = req.body.ServicesIdArray;
        const entry = await servicesModel.updateMany({ _id: { $in: obj } }, {
            softDelete: 0
        }, (err, result) => {
            return res.status(200).json({
                success: true,
                message: "Restore Successfully"
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
// -u http://localhost:1509/delete/many/voucher

router.patch('/trash/delete/many/services', async function (req, res, next) {
    try {
        let obj = req.body.ServicesIdArray;
        const entry = await servicesModel.deleteMany({ _id: { $in: obj } }, (err, result) => {
            return res.status(200).json({
                success: true,
                message: "Deleted Successfully"
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





//! CODE API FOR PERMISSION EMPLOYEE

module.exports = router;
