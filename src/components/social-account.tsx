import Link from "next/link";
import React from "react";
import Image from "next/image";

type SocialAccountProps = {
  platform: string;
  account: string;
};

const SocialAccount: React.FC<SocialAccountProps> = ({ platform, account }) => {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border hover:bg-gray-300 pt-1">
      <Link href={`https://${platform}.com/${account}`}>
        <a target="_blank">
          <Image
            src={`/${platform}.png`}
            alt={platform}
            height={32}
            width={32}
          />
        </a>
      </Link>
    </div>
  );
};

export default SocialAccount;
