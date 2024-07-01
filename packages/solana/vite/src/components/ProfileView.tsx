import { useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { CivicProfile, Profile } from "@civic/profile";
import user from "../user.jpg";
import { ScoreView } from "./ScoreView";
import twitterLogo from "./twitter.svg"

export const ProfileView = () => {
  const wallet = useAnchorWallet();
  const [profile, setProfile] = useState<Profile>();
  useEffect(() => {
    if (!wallet) return;
    CivicProfile.get("did:sol:" + wallet.publicKey.toString()).then(setProfile);
  }, [wallet]);

  if (!profile) return <></>;

  const twitter = profile.identifiers?.find((id) => id.type === "twitter2"); // TODO replace with twitter

  return <div className="pr-5 flex flex-row justify-center items-center">
    <div className="pr-5">{profile.name?.value}</div>
    <a href={"https://civic.me/" + wallet?.publicKey} target="_blank">
      <img src={profile.image?.url || user} alt="profile" className="w-8 h-8 rounded-full border-gray-400 border-2" />
    </a>
    {twitter && <div className="pr-5 pl-5">
      <a href={"https://twitter.com/" + twitter.value} target="_blank">
        <img src={twitterLogo} alt="twitter" className="w-8 h-8" />
      </a>
    </div>}
    <ScoreView />
  </div>;
};