"use client"
import React from "react";
import "./Share.css";
import share from "../../../public/share.gif";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { MdAlternateEmail, MdEmail } from "react-icons/md";
import {
  SiHatenabookmark,
  SiInstapaper,
  SiLivejournal,
  SiOdnoklassniki,
  SiWorkplace,
} from "react-icons/si";
import {
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  VKShareButton,
  ViberShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";
import {
  FaFacebookF,
  FaGetPocket,
  FaLine,
  FaLinkedinIn,
  FaPinterest,
  FaRedditAlien,
  FaTelegram,
  FaTumblr,
  FaViber,
  FaWhatsapp,
} from "react-icons/fa";
import { SlSocialVkontakte } from "react-icons/sl";

export default function Share(props) {
  return (
    <div className="share-app d-flex a-center f-poppins" style={props?.style}>
      <Image width={50} height={50} src={share} alt="share" />
      <div>
        <p className="primary">Share {props.arise ? props.arise : "Animoon"}</p>
        <p className="secoi">to your friends</p>
      </div>{" "}
      <WhatsappShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundL">
            <FaWhatsapp className="iconS" size={20} />
            <span>Share</span>
          </div>
        </span>
      </WhatsappShareButton>
      <FacebookShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundF">
            <FaFacebookF size={15} />
            <span>Share</span>
          </div>
        </span>
      </FacebookShareButton>
      <TelegramShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundT">
            <FaTelegram size={20} />
            <span>Share</span>
          </div>
        </span>
      </TelegramShareButton>
      <RedditShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundG">
            <FaRedditAlien size={20} />
            <span>Share</span>
          </div>
        </span>
      </RedditShareButton>
      <TwitterShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundTw">
            <FaXTwitter size={20} />
            <span>Tweet</span>
          </div>
        </span>
      </TwitterShareButton>
      <EmailShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundEm">
            <MdEmail size={20} />
            <span>Share</span>
          </div>
        </span>
      </EmailShareButton>
      <HatenaShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundJp">
            <SiHatenabookmark size={20} />
            <span>Share</span>
          </div>
        </span>
      </HatenaShareButton>
      <InstapaperShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundIn">
            <SiInstapaper size={15} />
            <span>Share</span>
          </div>
        </span>
      </InstapaperShareButton>
      <LineShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundLn">
            <FaLine size={20} />
            <span>Share</span>
          </div>
        </span>
      </LineShareButton>
      <LinkedinShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundLk">
            <FaLinkedinIn size={20} />
            <span>Share</span>
          </div>
        </span>
      </LinkedinShareButton>
      <LivejournalShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundJr">
            <SiLivejournal size={20} />
            <span>Share</span>
          </div>
        </span>
      </LivejournalShareButton>
      <MailruShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundAl">
            <MdAlternateEmail size={20} />
            <span>Share</span>
          </div>
        </span>
      </MailruShareButton>
      <OKShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundOk">
            <SiOdnoklassniki size={20} />
            <span>Share</span>
          </div>
        </span>
      </OKShareButton>
      <PinterestShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundPi">
            <FaPinterest size={20} />
            <span>Share</span>
          </div>
        </span>
      </PinterestShareButton>
      <PocketShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundPo">
            <FaGetPocket size={20} />
            <span>Share</span>
          </div>
        </span>
      </PocketShareButton>
      <TumblrShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundTu">
            <FaTumblr size={15} />
            <span>Share</span>
          </div>
        </span>
      </TumblrShareButton>
      <ViberShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundVi">
            <FaViber size={20} />
            <span>Share</span>
          </div>
        </span>
      </ViberShareButton>
      <VKShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundVk">
            <SlSocialVkontakte size={20} />
            <span>Share</span>
          </div>
        </span>
      </VKShareButton>
      <WorkplaceShareButton url={props.ShareUrl}>
        <span>
          {" "}
          <div className="bundWp">
            <SiWorkplace size={20} />
            <span>Tweet</span>
          </div>
        </span>
      </WorkplaceShareButton>
    </div>
  );
}
