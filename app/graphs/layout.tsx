import PageLayout from "@/components/PageLayout";

export default function GraphsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PageLayout>{children}</PageLayout>;
}
