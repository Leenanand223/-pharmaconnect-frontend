import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

const medicineData = {
  "paracetamol": {
    dosage: "500mg every 6-8 hours",
    sideEffects: "Nausea, liver damage in high doses",
    usage: "Used for fever and mild pain relief",
    warning: "Do not exceed 4g per day"
  },
  "amoxicillin": {
    dosage: "500mg every 8 hours",
    sideEffects: "Diarrhea, allergic reactions",
    usage: "Used for bacterial infections",
    warning: "Complete full course even if symptoms improve"
  },
  "ibuprofen": {
    dosage: "200-400mg every 6-8 hours",
    sideEffects: "Stomach upset, kidney issues in long-term use",
    usage: "Used for inflammation and pain",
    warning: "Take with food to reduce stomach irritation"
  },
  "azithromycin": {
    dosage: "500mg once daily for 3-5 days",
    sideEffects: "Diarrhea, nausea",
    usage: "Used for bacterial infections",
    warning: "Avoid if allergic to macrolides"
  },
  "cetirizine": {
    dosage: "10mg once daily",
    sideEffects: "Drowsiness, dry mouth",
    usage: "Used for allergies",
    warning: "Avoid driving if drowsy"
  },
  "metformin": {
    dosage: "500mg twice daily with meals",
    sideEffects: "Nausea, stomach upset",
    usage: "Used for type 2 diabetes",
    warning: "Do not skip meals to avoid low blood sugar"
  },
  "atorvastatin": {
    dosage: "10-20mg once daily",
    sideEffects: "Muscle pain, liver issues",
    usage: "Used for high cholesterol",
    warning: "Avoid grapefruit juice"
  },
  "omeprazole": {
    dosage: "20mg once daily",
    sideEffects: "Headache, nausea",
    usage: "Used for acid reflux",
    warning: "Take before meals"
  },
  "salbutamol": {
    dosage: "2 puffs every 4-6 hours as needed",
    sideEffects: "Tremor, rapid heartbeat",
    usage: "Used for asthma relief",
    warning: "Do not exceed recommended doses"
  },
  "diclofenac": {
    dosage: "50mg 2-3 times daily",
    sideEffects: "Stomach irritation, headache",
    usage: "Used for pain and inflammation",
    warning: "Take with food or milk"
  },
  "losartan": {
    dosage: "50mg once daily",
    sideEffects: "Dizziness, low blood pressure",
    usage: "Used for high blood pressure",
    warning: "Avoid sudden standing to prevent dizziness"
  },
  "lisinopril": {
    dosage: "10mg once daily",
    sideEffects: "Cough, dizziness",
    usage: "Used for high blood pressure",
    warning: "Monitor potassium levels"
  },
  "levothyroxine": {
    dosage: "25-100mcg once daily",
    sideEffects: "Nervousness, insomnia",
    usage: "Used for hypothyroidism",
    warning: "Take on empty stomach"
  },
  "ciprofloxacin": {
    dosage: "500mg twice daily",
    sideEffects: "Nausea, tendonitis",
    usage: "Used for bacterial infections",
    warning: "Avoid in children and during pregnancy"
  },
  "clindamycin": {
    dosage: "300mg every 6-8 hours",
    sideEffects: "Diarrhea, nausea",
    usage: "Used for bacterial infections",
    warning: "May cause C. difficile infection"
  }
};

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "👋 Hello! I'm your AI Health Assistant. I can help you with:\n\n• Medication information\n• Side effects and dosages\n• General health advice\n• Appointment reminders\n• Prescription details\n\nWhat would you like to know?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getHealthResponse = (msg) => {
    // Greetings
    if (msg.match(/\b(hi|hello|hey|good morning|good evening)\b/i)) {
      return "Hello! How can I assist you with your health questions today?";
    }

    // Appointment queries
    if (msg.match(/\b(appointment|schedule|booking|consultation)\b/i)) {
      return "📅 You have 2 upcoming appointments:\n\n1. Tomorrow at 10:00 AM with Dr. Sarah Smith\n2. Friday at 3:00 PM with Dr. Mike Wilson\n\nWould you like to book a new appointment or reschedule?";
    }

    // Prescription queries
    if (msg.match(/\b(prescription|medicine list|my medications)\b/i)) {
      return "💊 Your active prescriptions:\n\n1. Amoxicillin 500mg - Take 3 times daily with food\n2. Paracetamol 500mg - Take as needed for pain\n\nRemember to complete the full course of antibiotics!";
    }

    // Health tips
    if (msg.match(/\b(health tip|advice|wellness|healthy)\b/i)) {
      return "🌟 Health Tips:\n\n• Stay hydrated - drink 8 glasses of water daily\n• Take medications with food when required\n• Get 7-8 hours of sleep\n• Exercise regularly\n• Never skip doses\n• Avoid alcohol with medications";
    }

    // Side effects
    if (msg.match(/\b(side effect|adverse|reaction)\b/i)) {
      return "⚠️ If you're experiencing side effects:\n\n1. Note the symptoms and timing\n2. Check if it's listed in your medication guide\n3. Contact your pharmacist immediately if severe\n4. Don't stop medication without consulting\n\nCommon side effects usually subside in a few days.";
    }

    // Dosage questions
    if (msg.match(/\b(dosage|how much|how many|dose)\b/i)) {
      return "📋 Dosage Information:\n\nAlways follow your pharmacist's instructions. General guidelines:\n\n• Take at the same time each day\n• Don't double dose if you miss one\n• Use a pill organizer\n• Set reminders\n\nWhich medication do you need dosage info for?";
    }

    // Emergency
    if (msg.match(/\b(emergency|urgent|severe|911|help)\b/i)) {
      return "🚨 EMERGENCY:\n\nIf you're experiencing:\n• Difficulty breathing\n• Chest pain\n• Severe allergic reaction\n• Loss of consciousness\n\nCall emergency services (911) immediately!\n\nFor non-emergencies, contact your pharmacist or doctor.";
    }

    // Medicine-specific info
    for (const med in medicineData) {
      if (msg.includes(med)) {
        const info = medicineData[med];
        return `💊 **${med.charAt(0).toUpperCase() + med.slice(1)}**\n\n📌 Dosage: ${info.dosage}\n\n⚠️ Side Effects: ${info.sideEffects}\n\n✅ Usage: ${info.usage}\n\n🔴 Warning: ${info.warning}\n\nDo you have any specific questions about this medication?`;
      }
    }

    // Drug interactions
    if (msg.match(/\b(interaction|mix|combine|together)\b/i)) {
      return "⚠️ Drug Interactions:\n\nNever mix medications without consulting your pharmacist. Common interactions:\n\n• Alcohol + Antibiotics\n• Grapefruit + Statins\n• NSAIDs + Blood thinners\n\nAlways inform your pharmacist about all medications you're taking!";
    }

    // Storage
    if (msg.match(/\b(store|storage|keep|refrigerate)\b/i)) {
      return "🏠 Medication Storage:\n\n• Keep in cool, dry place\n• Away from direct sunlight\n• Out of reach of children\n• Check expiry dates\n• Some need refrigeration\n\nCheck your medication label for specific storage instructions.";
    }

    // Default response with suggestions
    return "I'm here to help! You can ask me about:\n\n• Specific medications (e.g., 'Tell me about paracetamol')\n• Side effects and dosages\n• Your appointments\n• Your prescriptions\n• General health advice\n• Drug interactions\n\nWhat would you like to know?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    const msg = input.toLowerCase();

    setTimeout(() => {
      const botReply = getHealthResponse(msg);
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
      setIsTyping(false);
    }, 800);

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl flex flex-col w-full h-full border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex justify-between items-center rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-full">
            <FaRobot size={20} />
          </div>
          <div>
            <h4 className="font-bold text-lg">AI Health Assistant</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100">Online • HIPAA Compliant</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                msg.from === "bot"
                  ? "bg-white text-gray-900 border border-gray-200"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              }`}
            >
              {msg.from === "bot" && (
                <div className="flex items-center space-x-2 mb-2">
                  <FaRobot className="text-purple-600" size={14} />
                  <span className="text-xs font-semibold text-purple-600">AI Assistant</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about medications, side effects, dosages..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FaPaperPlane />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 Try asking: "Tell me about paracetamol" or "What are my appointments?"
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
