function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      {children}
    </div>
  )
}

export default function HowItWorks() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">How it works</h1>
      <div className="border border-amber-300 bg-amber-50 text-amber-800 rounded p-3 text-sm">
        Illustrative simulated data. Ye actual building measurements nahi hain.
        Agla phase real meters ya public datasets (LEAD, Zenodo water anomaly) par testing hai.
      </div>

      <Section title="Hamara asool">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Zyada consumption ka matlab confirmed waste nahi. Inspection aur measured improvement ke baad hi confirm hota hai.</li>
          <li>Estimated savings aur verified savings hamesha alag dikhte hain.</li>
          <li>Action ke baad data kam ho to verified savings Rs 0 aur "monitoring jari rakhein".</li>
          <li>Insaan ka review zaroori hai: Manager review aur approve karta hai, Technician kaam complete karta hai.</li>
        </ul>
      </Section>

      <Section title="Pipeline (5 qadam)">
        <ol className="list-decimal ml-5 space-y-1 text-sm">
          <li><b>Detect:</b> normal behaviour seekh kar raat ke ghanton mein excess dhoondta hai.</li>
          <li><b>Rank:</b> priority = potential cost x confidence / 100.</li>
          <li><b>Review:</b> Manager valid issue, false alarm ya needs more data chunta hai.</li>
          <li><b>Act:</b> approve hone par Technician ko task milta hai.</li>
          <li><b>Verify:</b> kaam ke baad ki asal readings se saving naapi jati hai.</li>
        </ol>
      </Section>

      <Section title="Detection methods">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li><b>Electricity:</b> median baseline aur Isolation Forest. Dono agree karein to ensemble flag karta hai, is se false alarms kam hote hain.</li>
          <li><b>Water:</b> Minimum Night Flow. Raat 01:00 se 05:00 ka flow normal se bohat zyada ho aur kam az kam 2 raatein tak rahe to possible leak.</li>
          <li><b>Upload:</b> CSV pehle validate hoti hai. Negative, text, duplicate aur missing data saaf hota hai ya file reject hoti hai.</li>
        </ul>
      </Section>

      <Section title="Confidence score">
        <p className="text-sm mb-2">Score 0 se 100 hai. High 75 ya zyada, Medium 50 ya zyada, Low 50 se kam.</p>
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li><b>Electricity:</b> 50% models ki agreement, 30% kitni raatein lagatar, 20% data quality.</li>
          <li><b>Water:</b> 40% persistence, 30% consistency, 20% magnitude, 10% data quality.</li>
          <li>Score 95 se upar nahi jata, kyunke 100% pakka koi nahi hota.</li>
        </ul>
      </Section>

      <Section title="Limitations (hum khud bata rahe hain)">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Saara data simulated hai. Ground-truth labels sirf simulation mein hain.</li>
          <li>Akela Isolation Forest simple baseline se behtar nahi tha. Dono ka ensemble behtar hai.</li>
          <li>Water tariff Rs 200/m3 ek assumption hai.</li>
          <li>Roles sirf dropdown hain, real login nahi.</li>
          <li>Verification mein weather aur occupancy ka adjustment nahi hai.</li>
        </ul>
      </Section>

      <Section title="Roadmap (abhi bana nahi)">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Real meters ya LEAD dataset par testing</li>
          <li>Weather aur occupancy adjustment</li>
          <li>Real login aur roles</li>
          <li>Live sensor feeds aur deployment</li>
        </ul>
      </Section>
    </div>
  )
}