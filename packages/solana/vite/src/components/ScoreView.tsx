import { useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import GaugeChart from 'react-gauge-chart'

export const ScoreView = () => {
  const wallet = useAnchorWallet();
  const [score, setScore] = useState<number>(0);
  useEffect(() => {
    if (!wallet) return;
    fetch(`https://api.civic.com/identity-store/did:sol:${wallet.publicKey.toString()}/score`)
      .then((res) => res.json())
      .then((data) => setScore(data.score.score));
  }, [wallet]);

  return <GaugeChart id="score-gauge"
                     style={{
                       height: 50,
                       width: 120
                     }}
                     nrOfLevels={30}
                     colors={["#FF5F6D", "#FFC371"]}
                     arcWidth={0.3}
                     percent={score / 100}
  />
};