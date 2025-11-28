import Sidebar from "@/components/Sidebar";

export default function GraphsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0f172a]">
            <Sidebar />
            <div className="md:ml-64 transition-all duration-300">
                {children}
            </div>
        </div>
    );
}

