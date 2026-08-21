export default function PoliciesPage() {
  return (
    <div className="max-w-3xl flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-medium tracking-tight mb-2">Policies & Rules</h1>
        <p className="text-gray-400">Guidelines for the microgrid community</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-medium text-[var(--color-status-online)]">Who can connect to this microgrid</h2>
        <div className="text-gray-300 space-y-4 leading-relaxed">
          <p>
            The microgrid is designed to serve households within a 2km radius of the main 
            generation hub. To connect, a household must be registered with the local Panchayat 
            and agree to the community load-sharing framework.
          </p>
          <p>
            Commercial connections (e.g., mills, large refrigeration units) require special 
            approval and are subject to time-of-use restrictions to prevent draining the 
            battery storage during peak household hours.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-medium text-[var(--color-status-online)]">Safe usage guidelines</h2>
        <div className="text-gray-300 space-y-4 leading-relaxed">
          <p>
            Every connected household is fitted with a smart meter that monitors real-time consumption. 
            To ensure stability, residents should avoid running high-draw appliances (heaters, pumps) 
            simultaneously during the evening peak hours (6 PM - 9 PM).
          </p>
          <p>
            Tampering with the smart meter or attempting to bypass the connection is strictly 
            prohibited and will result in immediate disconnection to protect the grid infrastructure.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-medium text-[var(--color-status-online)]">What to do during an outage</h2>
        <div className="text-gray-300 space-y-4 leading-relaxed">
          <p>
            In the event of an unexpected outage, the system will attempt to automatically isolate the 
            fault and restore power to unaffected segments. Residents should unplug sensitive electronics 
            until power is fully stabilized.
          </p>
          <p>
            If power is not restored within 30 minutes, check the public dashboard for critical alerts. 
            The community operator will dispatch a maintenance team if physical intervention is required.
          </p>
        </div>
      </section>
    </div>
  );
}
