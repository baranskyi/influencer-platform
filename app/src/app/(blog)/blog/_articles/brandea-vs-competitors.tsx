export default function BrandeaVsCompetitors() {
  return (
    <>
      <p>
        If you&apos;re looking for a tool to manage your creator business,
        you&apos;ve probably come across HoneyBook, Bonsai, and Notion. They&apos;re
        all solid products — but none of them were built specifically for content
        creators and influencers.
      </p>

      <p>
        Here&apos;s an honest comparison so you can make the right choice for
        your workflow.
      </p>

      <h2>Quick comparison</h2>

      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-4 text-left font-semibold">Feature</th>
              <th className="py-3 pr-4 text-left font-semibold text-orange">brandea.today</th>
              <th className="py-3 pr-4 text-left font-semibold">HoneyBook</th>
              <th className="py-3 pr-4 text-left font-semibold">Bonsai</th>
              <th className="py-3 text-left font-semibold">Notion</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-white/5">
              <td className="py-3 pr-4 font-medium text-foreground">Price</td>
              <td className="py-3 pr-4 text-orange">Free / $29/mo</td>
              <td className="py-3 pr-4">$36/mo+</td>
              <td className="py-3 pr-4">$15/mo+</td>
              <td className="py-3">Free / $10/mo</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 pr-4 font-medium text-foreground">Deal pipeline</td>
              <td className="py-3 pr-4">Built-in Kanban</td>
              <td className="py-3 pr-4">Generic project view</td>
              <td className="py-3 pr-4">Premium only ($39/mo)</td>
              <td className="py-3">Manual setup required</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 pr-4 font-medium text-foreground">Invoicing</td>
              <td className="py-3 pr-4">One-click PDF</td>
              <td className="py-3 pr-4">Built-in</td>
              <td className="py-3 pr-4">Built-in</td>
              <td className="py-3">Not available</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 pr-4 font-medium text-foreground">Content calendar</td>
              <td className="py-3 pr-4">Included</td>
              <td className="py-3 pr-4">Not available</td>
              <td className="py-3 pr-4">Not available</td>
              <td className="py-3">Manual setup</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 pr-4 font-medium text-foreground">Client CRM</td>
              <td className="py-3 pr-4">Included</td>
              <td className="py-3 pr-4">Included</td>
              <td className="py-3 pr-4">Included</td>
              <td className="py-3">Manual setup</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 pr-4 font-medium text-foreground">Analytics</td>
              <td className="py-3 pr-4">Revenue dashboard</td>
              <td className="py-3 pr-4">Basic reporting</td>
              <td className="py-3 pr-4">Time tracking focus</td>
              <td className="py-3">Not available</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 pr-4 font-medium text-foreground">Built for</td>
              <td className="py-3 pr-4 text-orange">Creators &amp; influencers</td>
              <td className="py-3 pr-4">Generic creatives</td>
              <td className="py-3 pr-4">Generic freelancers</td>
              <td className="py-3">Everyone (no focus)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-medium text-foreground">Setup time</td>
              <td className="py-3 pr-4">2 minutes</td>
              <td className="py-3 pr-4">15–30 minutes</td>
              <td className="py-3 pr-4">10–20 minutes</td>
              <td className="py-3">Hours of building</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>HoneyBook ($36/month+)</h2>

      <p>
        HoneyBook is a solid platform for photographers, event planners, and
        service-based creatives. It handles contracts, proposals, and online
        payments really well. But it wasn&apos;t designed for content creators.
      </p>

      <ul>
        <li>No content calendar or deliverable tracking</li>
        <li>No creator-specific deal pipeline (pitch → negotiate → deliver → paid)</li>
        <li>Payment processing takes a 3% fee on top of the subscription</li>
        <li>Starts at $36/month — no free tier for small creators</li>
      </ul>

      <p>
        <strong>Best for:</strong> Wedding photographers and event planners who
        need contracts and online payments.
      </p>

      <h2>Bonsai ($15/month+)</h2>

      <p>
        Bonsai started as a freelancer invoicing tool and has expanded into
        proposals, contracts, and accounting. It&apos;s great for traditional
        freelancers — developers, designers, writers — but it misses the mark
        for influencers.
      </p>

      <ul>
        <li>Deal pipeline is locked behind the Premium plan ($39/month)</li>
        <li>No content calendar</li>
        <li>Focused on hourly/project billing, not brand deal structures</li>
        <li>UI is designed for service providers, not creators</li>
      </ul>

      <p>
        <strong>Best for:</strong> Freelance developers and designers who bill by
        the hour and need contracts.
      </p>

      <h2>Notion (Free / $10/month)</h2>

      <p>
        Notion is incredibly flexible — you can build almost anything with it.
        The problem is, you <em>have</em> to build everything yourself. There&apos;s
        no native invoicing, no deal pipeline, no analytics. You&apos;re
        starting from a blank page.
      </p>

      <ul>
        <li>Requires hours of setup to build a deal tracker</li>
        <li>No invoicing — you need a separate tool</li>
        <li>No revenue analytics or dashboards</li>
        <li>Easy to over-engineer and hard to maintain</li>
      </ul>

      <p>
        <strong>Best for:</strong> People who enjoy building systems and
        don&apos;t mind spending time on setup.
      </p>

      <h2>brandea.today (Free / $29/month)</h2>

      <p>
        brandea.today is purpose-built for content creators and influencers. Every
        feature — the deal pipeline, invoicing, content calendar, client CRM,
        analytics — is designed around how creators actually work with brands.
      </p>

      <ul>
        <li>
          <strong>Free tier:</strong> Up to 5 active deals with basic invoicing —
          no credit card required
        </li>
        <li>
          <strong>2-minute setup:</strong> Sign up, create your first deal, and
          start tracking
        </li>
        <li>
          <strong>Creator-first pipeline:</strong> Stages that match your
          workflow (Pitched → Negotiating → In Progress → Delivered → Paid)
        </li>
        <li>
          <strong>All-in-one:</strong> No need to stitch together 4 different
          tools
        </li>
      </ul>

      <div className="my-8 rounded-xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-semibold text-orange">Our honest take</p>
        <p className="mt-2">
          If you&apos;re a photographer or event planner, HoneyBook is probably
          better for you. If you bill by the hour, try Bonsai. If you love
          building your own systems, use Notion. But if you&apos;re an influencer
          or content creator who wants something that just works — without the
          setup, without the high price tag — give brandea.today a try.
        </p>
      </div>
    </>
  );
}
