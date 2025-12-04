import PageLayout from "@/components/PageLayout";

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PageLayout>{children}</PageLayout>;
}
