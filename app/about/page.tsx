import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-200 p-8 md:p-12">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Header Section */}
                <section className="text-center space-y-6 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tight">
                        About VantEdge
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        RF Noise Mapping in Campus Environment • IEEE AP-S Project
                    </p>
                </section>

                {/* 1. About the Team */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-semibold text-cyan-400 border-b border-slate-800 pb-2">1. About the Team</h2>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">Team VantEdge – IEEE AP-S (BMSIT&M)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                            <div className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-cyan-900/50 rounded-full flex items-center justify-center mb-3 text-cyan-400 font-bold text-xl">JK</div>
                                <h4 className="text-lg font-bold text-slate-200">Jishnu K</h4>
                                <p className="text-sm text-slate-400">1BY24EC069</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-cyan-900/50 rounded-full flex items-center justify-center mb-3 text-cyan-400 font-bold text-xl">CR</div>
                                <h4 className="text-lg font-bold text-slate-200">Chinmay Ravindra Gowda</h4>
                                <p className="text-sm text-slate-400">1BY24EC037</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-cyan-900/50 rounded-full flex items-center justify-center mb-3 text-cyan-400 font-bold text-xl">AP</div>
                                <h4 className="text-lg font-bold text-slate-200">Arnav Paniya</h4>
                                <p className="text-sm text-slate-400">1BY24EC026</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-cyan-900/50 rounded-full flex items-center justify-center mb-3 text-cyan-400 font-bold text-xl">AS</div>
                                <h4 className="text-lg font-bold text-slate-200">Adithya S P</h4>
                                <p className="text-sm text-slate-400">1BY24EC007</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-700 text-center text-slate-400">
                            <p className="font-medium mb-2">Areas of Contribution</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-sm">Hardware Design</span>
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-sm">Firmware Development</span>
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-sm">Dashboard UI/UX</span>
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-sm">Data Processing</span>
                                <span className="px-3 py-1 rounded-full bg-slate-800 text-sm">Research & Documentation</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. About the Project */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-cyan-400 border-b border-slate-800 pb-2">2. About the Project</h2>
                    <div className="text-slate-300 space-y-4 leading-relaxed text-lg">
                        <p>
                            <strong>VantEdge</strong> is a cutting-edge initiative designed to address the invisible challenge of Radio Frequency (RF) noise in educational campuses.
                            Our system utilizes a network of <strong>ESP32-based multi-node sensor devices</strong> to monitor, log, and visualize RF noise levels, interference, and signal strength across the <strong>BMSIT&M campus</strong>.
                        </p>
                        <p>
                            <strong>Why this matters:</strong> As wireless dependency grows, signal interference becomes a critical bottleneck for connectivity.
                            Our solution helps network administrators optimize WiFi networks, identify dead zones, and detect interference-heavy areas, enabling data-driven smart-campus planning.
                        </p>
                        <p>
                            <strong>Approach:</strong> The system deploys multiple portable nodes equipped with GPS for automatic geotagging.
                            Data is stored locally on SD cards for redundancy and uploaded to the cloud for real-time processing.
                            The result is an interactive dashboard that provides a live heatmap of the RF environment.
                        </p>
                        <p className="text-cyan-300/80 italic">
                            Key Features: Portable • Low-cost • Battery Powered • Future-ready
                        </p>
                    </div>
                </section>

                {/* 3. Components Used */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-semibold text-cyan-400 border-b border-slate-800 pb-2">3. Components Used</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <ul className="space-y-4 text-slate-300 list-disc list-inside text-lg">
                            <li>
                                <strong className="text-slate-100">ESP32 NodeMCU:</strong> The core microcontroller responsible for WiFi scanning and data processing.
                            </li>
                            <li>
                                <strong className="text-slate-100">NEO-6M GPS Module:</strong> Enables automatic geotagging of every signal reading for precise mapping.
                            </li>
                            <li>
                                <strong className="text-slate-100">SD Card Module:</strong> Provides dual storage capability, ensuring data is saved even without internet connectivity.
                            </li>
                            <li>
                                <strong className="text-slate-100">Antenna (2.4 GHz):</strong> Enhances RF reception sensitivity for more accurate noise detection.
                            </li>
                            <li>
                                <strong className="text-slate-100">Li-ion Battery + Charge Controller:</strong> Ensures the system is fully portable and rechargeable.
                            </li>
                            <li>
                                <strong className="text-slate-100">OLED Display (SSD1306):</strong> Shows live device statistics and connection status in the field.
                            </li>
                            <li>
                                <strong className="text-slate-100">Solar Support:</strong> Designed with future-ready power inputs for sustainable operation.
                            </li>
                        </ul>
                        <div className="relative group">
                            <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden border-2 border-slate-700 shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:border-cyan-500/50 transition-all duration-500">
                                <Image
                                    src="/project.jpeg"
                                    alt="System circuit diagram – ESP32-based RF monitoring unit"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-center text-sm text-slate-500 mt-3 italic">
                                “System circuit diagram – ESP32-based RF monitoring unit.”
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. Real-World Applications */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-cyan-400 border-b border-slate-800 pb-2">4. Real-World Applications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            "Campus-wide RF noise heatmapping",
                            "Detecting poor WiFi zones",
                            "Identifying interference-heavy areas",
                            "Improving network planning for events/exams",
                            "Research & lab demonstrations",
                            "Deployable in smart cities, malls, & airports"
                        ].map((useCase, index) => (
                            <div key={index} className="p-4 bg-slate-900/40 border border-slate-800 rounded-lg hover:bg-slate-800/60 hover:border-cyan-500/30 transition-all">
                                <p className="text-slate-200 font-medium text-center">{useCase}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. How the System Works */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-cyan-400 border-b border-slate-800 pb-2">5. How the System Works (Technical Flow)</h2>
                    <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-800 space-y-4 text-lg text-slate-300">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-center md:text-left">
                            <div className="flex-1">
                                <span className="text-cyan-500 font-bold block mb-1">Step 1: Sensing</span>
                                Multiple ESP32 nodes gather RSSI, noise floor, and signal strength data.
                            </div>
                            <div className="hidden md:block text-slate-600">→</div>
                            <div className="flex-1">
                                <span className="text-cyan-500 font-bold block mb-1">Step 2: Tagging</span>
                                GPS module auto-tags each measurement with precise latitude/longitude.
                            </div>
                            <div className="hidden md:block text-slate-600">→</div>
                            <div className="flex-1">
                                <span className="text-cyan-500 font-bold block mb-1">Step 3: Storage</span>
                                Data is stored locally on SD cards and simultaneously uploaded to the cloud.
                            </div>
                            <div className="hidden md:block text-slate-600">→</div>
                            <div className="flex-1">
                                <span className="text-cyan-500 font-bold block mb-1">Step 4: Visualization</span>
                                The dashboard processes the data to build real-time heatmaps and analytics.
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. What Makes Our Solution Unique (UVP) */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-semibold text-cyan-400 border-b border-slate-800 pb-2">6. What Makes Our Solution Unique (UVP)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-2">Cost & Efficiency</h3>
                            <p className="text-slate-400">Significantly lower cost than bulky industrial RF survey tools, making it accessible for educational and research purposes.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-2">Automation</h3>
                            <p className="text-slate-400">Automatic GPS tagging eliminates manual errors (unlike older manual methods), ensuring high-fidelity data.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-2">Resilience</h3>
                            <p className="text-slate-400">Works offline due to SD card redundancy and features long battery life with future solar support.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-2">Scalability</h3>
                            <p className="text-slate-400">Multi-node simultaneous sensing allows for rapid coverage of large campuses. Fully open-source for research.</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
