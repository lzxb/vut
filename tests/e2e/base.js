import { Selector } from 'testcafe'

fixture`base`
  .page`http://localhost:3000/base/index.html`

test('base', async t => {
  await t
    .expect(Selector('#app-vue p').textContent).eql('0')
    .expect(Selector('#app-react p').textContent).eql('0')
    .click('#app-vue .plus')
    .expect(Selector('#app-vue p').textContent).eql('1')
    .expect(Selector('#app-react p').textContent).eql('1')
    .click('#app-react .plus')
    .expect(Selector('#app-vue p').textContent).eql('2')
    .expect(Selector('#app-react p').textContent).eql('2')

    .click('#app-vue .minus')
    .expect(Selector('#app-vue p').textContent).eql('1')
    .expect(Selector('#app-react p').textContent).eql('1')
    .click('#app-react .minus')
    .expect(Selector('#app-vue p').textContent).eql('0')
    .expect(Selector('#app-react p').textContent).eql('0')

    .typeText('#app-vue .input', '1000')
    .expect(Selector('#app-vue p').textContent).eql('1000')
    .expect(Selector('#app-react p').textContent).eql('1000')
    .typeText('#app-react .input', '500')
    .expect(Selector('#app-vue p').textContent).eql('1000500')
    .expect(Selector('#app-react p').textContent).eql('1000500')
})
