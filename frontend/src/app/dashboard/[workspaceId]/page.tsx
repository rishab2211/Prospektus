"use client";

import React from "react";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

const Page = ({ params }: Props) => {
  const { workspaceId } = React.use(params);

  return <div>Workspace: {workspaceId}</div>;
};

export default Page;
