import { RxChatPage } from './app.po';

describe('rx-chat App', function() {
  let page: RxChatPage;

  beforeEach(() => {
    page = new RxChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
