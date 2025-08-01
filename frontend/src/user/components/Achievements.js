import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Calendar, Building, Download, Award, Search } from "lucide-react";

const mockProfile = {
  name: "Rushika",
  email: "rushika@example.com",
  organization: "IIIT Hyderabad",
};

const HACKATHON_DATA = [
  {
    id: 1,
    title: "Hackathon A",
    organization: "Org A",
    date: "2023-11-15",
    badge: "🏆",
    category: "AI/ML",
  },
  {
    id: 2,
    title: "Hackathon B",
    organization: "Org B",
    date: "2023-10-20",
    badge: "🌟",
    category: "Web Development",
  },
];

const useProfile = () => {
  const [profile, setProfile] = useState(mockProfile);
  return { profile };
};

const AchievementCard = ({ hackathon, onClick }) => (
  <div
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
    onClick={onClick}
  >
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-3xl mb-2">{hackathon.badge}</span>
          <h3 className="text-xl font-bold text-gray-800 mt-2">{hackathon.title}</h3>
        </div>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
          {hackathon.category}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-gray-600 flex items-center">
          <Building className="w-4 h-4 mr-2" />
          {hackathon.organization}
        </p>
        <p className="text-gray-500 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(hackathon.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
);

const CertificateModal = ({ certificate, userName, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (certificate) {
      generateCertificate();
    }
  }, [certificate]);

  const generateCertificate = () => {
    if (!certificate) return;
    setIsGenerating(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = "#2c3e50";
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Hackstad Title
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Hackstad App", canvas.width / 2, 80);

      // Title
      ctx.font = "bold 30px Arial";
      ctx.fillText("Certificate of Achievement", canvas.width / 2, 130);

      // Subtitle
      ctx.font = "italic 20px Arial";
      ctx.fillText("Presented to", canvas.width / 2, 180);

      // Name
      ctx.font = "bold 32px Arial";
      ctx.fillStyle = "#e74c3c";
      ctx.fillText(userName, canvas.width / 2, 230);

      // College Name
      ctx.font = "20px Arial";
      ctx.fillStyle = "#34495e";
      ctx.fillText("IIIT Hyderabad", canvas.width / 2, 270);

      // Hackathon Name
      ctx.font = "22px Arial";
      ctx.fillText(`For excellence in ${certificate.title}`, canvas.width / 2, 320);

      // Organization
      ctx.font = "18px Arial";
      ctx.fillText(`Organized by ${certificate.organization}`, canvas.width / 2, 360);

      // Date
      ctx.font = "18px Arial";
      ctx.fillText(`Date: ${new Date(certificate.date).toLocaleDateString()}`, canvas.width / 2, 400);

      // Signatures
      ctx.font = "italic 16px Arial";
      ctx.fillText("Hackstad Admin", canvas.width / 3, 450);
      ctx.fillText("College Authority", (2 * canvas.width) / 3, 450);

      // Signature Lines
      ctx.beginPath();
      ctx.moveTo(canvas.width / 3 - 50, 460);
      ctx.lineTo(canvas.width / 3 + 50, 460);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo((2 * canvas.width) / 3 - 50, 460);
      ctx.lineTo((2 * canvas.width) / 3 + 50, 460);
      ctx.stroke();

      setIsGenerating(false);
    }, 1000);
  };

  const handleDownload = () => {
    if (!certificate) {
      console.error("Certificate data is missing");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${certificate.title}-${userName}-Certificate.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="text-center">
          <Award className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800">Your Certificate</h3>
        </div>

        <div className="relative bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 p-4 flex justify-center items-center">
          <canvas ref={canvasRef} width={700} height={500} className="border" />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 justify-center"
          >
            <Download className="w-4 h-4" />
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

const Achievement = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();

  const filteredHackathons = useMemo(() => {
    return HACKATHON_DATA.filter((hackathon) =>
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Achievements</h1>
      <input
        type="text"
        placeholder="Search hackathons..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border rounded-lg p-2 w-full mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHackathons.map((hackathon) => (
          <AchievementCard key={hackathon.id} hackathon={hackathon} onClick={() => setSelectedCertificate(hackathon)} />
        ))}
      </div>
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          userName={profile.name}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};

export default Achievement;
