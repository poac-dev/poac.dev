import { getHasuraClient } from "~/app/_lib/hasuraClient";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { Chip, Link, Code, Divider } from "@nextui-org/react";
import { format } from "timeago.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Params = {
    group: string;
    name: string;
    version: string;
};

type Props = {
    params: Params;
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    return {
        title: `${params.group}/${params.name} (v${params.version})`,
    };
}

export default async function Version({ params }: { params: Params }) {
    const hasuraClient = getHasuraClient();
    const data = await hasuraClient.getPackageByNameAndVersion({
        name: `${params.group}/${params.name}`,
        version: params.version,
    });
    if (!data || data.packages.length === 0) {
        return notFound();
    }

    const pack = data.packages[0];

    return (
        <div className="flex flex-col justify-center items-center gap-4 m-4">
            <div className="flex justify-center items-center gap-4">
                <h1 className="text-3xl font-bold">{pack.name}</h1>
                <h2 className="text-lg text-white/50">v{pack.version}</h2>
                <Chip>C++{pack.edition.toString().slice(-2)}</Chip>
            </div>
            <h3 className="text-xl text-white/50">{pack.description}</h3>
            <div className="flex flex-col lg:flex-row justify-start gap-4 items-start">
                <div className="flex flex-row justify-center gap-1 max-w-[200px]">
                    <Chip>{data.packages_aggregate?.aggregate?.count}</Chip>
                    <h4 className="text-lg font-bold">Versions</h4>
                </div>
                <div className="flex flex-row justify-center gap-1 max-w-[200px]">
                    <Chip>{pack.metadata["dependencies"]?.length ?? 0}</Chip>
                    <h4 className="text-lg font-bold">Dependencies</h4>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[200px]">
                    <h4 className="text-lg font-bold">Metadata</h4>
                    <Chip>{format(pack.published_at)}</Chip>
                    <Link
                        isExternal
                        href={`https://choosealicense.com/licenses/${pack.license.toLowerCase()}/`}
                    >
                        {pack.license}
                    </Link>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[200px] break-words">
                    <h4 className="text-lg font-bold">Install</h4>
                    <p className="text-xs">
                        Add the following line to your poac.toml file:
                    </p>
                    <Code>{`"${pack.name}" = "${pack.version}"`}</Code>
                </div>
                {pack.metadata["package"]["homepage"] && (
                    <div className="flex flex-col justify-center gap-1 max-w-[200px] break-all">
                        <h4 className="text-lg font-bold">Homepage</h4>
                        <Link
                            isExternal
                            href={pack.metadata["package"]["homepage"]}
                        >
                            {pack.metadata["package"]["homepage"]}
                        </Link>
                    </div>
                )}
                {pack.metadata["package"]["documentation"] && (
                    <div className="flex flex-col justify-center gap-1 max-w-[200px] break-all">
                        <h4 className="text-lg font-bold">Documentation</h4>
                        <Link
                            isExternal
                            href={pack.metadata["package"]["documentation"]}
                        >
                            {pack.metadata["package"]["documentation"]}
                        </Link>
                    </div>
                )}
                {pack.metadata["package"]["repository"] && (
                    <div className="flex flex-col justify-center gap-1 max-w-[200px] break-all">
                        <h4 className="text-lg font-bold">Repository</h4>
                        <Link
                            isExternal
                            href={pack.metadata["package"]["repository"]}
                        >
                            {pack.metadata["package"]["repository"]}
                        </Link>
                    </div>
                )}
            </div>
            <Divider />
            {pack.readme ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    skipHtml
                >
                    {pack.readme}
                </ReactMarkdown>
            ) : (
                <p className="text-white/50"
                >no readme found</p>
            )}
        </div>
    );
}