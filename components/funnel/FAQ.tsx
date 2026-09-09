import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { funnelConfig } from '@/config/funnel';

const method = funnelConfig.methodName;
const offer = funnelConfig.offerName;

// Blocco pronto ma non ancora montato in pagina, come nella landing di riferimento.
const faqs = [
  { question: 'È adatto a tutte?', answer: `Dipende da fototipo, colore e spessore del pelo: sono esattamente le cose che vengono valutate durante la ${offer}. Se il laser non può darti un risultato apprezzabile, te lo diciamo prima di iniziare.` },
  { question: 'Su quali zone si può lavorare?', answer: 'Su tutte le zone del corpo e del viso, comprese quelle delicate come ascelle e inguine, con potenza e tempi calibrati zona per zona.' },
  { question: 'Fa male?', answer: `Il ${method} usa la tecnologia Cryo, che raffredda la pelle mentre il laser agisce, e rallenta il ritmo della seduta per far dissipare il calore tra un impulso e l'altro.` },
  { question: 'Quanto dura il percorso?', answer: 'Dipende dalla zona e dal tuo ciclo di crescita, quindi si ragiona in tempi indicativi: la durata stimata viene definita in consulenza e messa per iscritto, insieme alle condizioni della garanzia.' },
  { question: 'Quanto costa?', answer: funnelConfig.pricePerZone ? `${funnelConfig.pricePerZone} a zona per seduta, con incluse la consulenza, l'analisi del ciclo di crescita e fino a 90 minuti di trattamento. I pacchetti personalizzati si vedono in consulenza.` : 'Il preventivo viene definito in consulenza, sulla base della zona e della durata indicativa del percorso.' },
  { question: 'Cosa succede dopo il video?', answer: `Puoi prenotare la tua ${offer} gratuita e il centro ti richiama per fissare giorno, orario e sede.` },
];

export function FAQ() {
  return (
    <section className="faq-section">
      <div className="faq-heading"><span className="section-index">DOMANDE FREQUENTI</span><h2>Prima di prenotare la consulenza.</h2></div>
      <Accordion className="faq-list">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`} className="faq-item">
            <AccordionTrigger className="faq-trigger"><span>0{index + 1}</span>{faq.question}</AccordionTrigger>
            <AccordionContent className="faq-answer"><p>{faq.answer}</p></AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
