import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch();
const scheme = process.env.SCHEME || 'light';
const errs = [];
for (const [name, w, h, act] of [['desktop', 1440, 900, null], ['mobile', 390, 844, null], ['card', 1440, 900, 'card'], ['partner', 1440, 900, 'partner'], ['rule', 1440, 900, 'rule']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
  p.on('pageerror', (e) => errs.push(name + ': ' + e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(name + ': ' + m.text()));
  await p.goto('http://localhost:4173/?sample', { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  if (act === 'card' || act === 'partner') await p.getByRole('button', { name: act === 'card' ? 'Card' : 'Partner', exact: true }).click();
  if (act === 'rule') { // add a rule that conflicts with R3 and moves Sharesies to investments
    await p.getByPlaceholder('pak n save').fill('sharesies');
    await p.locator('form[aria-label="Add a rule"] select').nth(1).selectOption('investments');
    await p.locator('form[aria-label="Add a rule"] select').nth(0).selectOption('100');
    await p.getByRole('button', { name: 'Add rule' }).click();
    await p.getByPlaceholder('pak n save').fill('contact');
    await p.locator('form[aria-label="Add a rule"] select').nth(0).selectOption('100');
    await p.getByRole('button', { name: 'Add rule' }).click();
  }
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  await p.close();
}
await b.close();
console.log(errs.length ? errs.join('\n') : 'no page errors');
