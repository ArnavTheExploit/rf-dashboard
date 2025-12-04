import PageLayout from "@/components/PageLayout";

export default function SelectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PageLayout>{children}</PageLayout>;
}
