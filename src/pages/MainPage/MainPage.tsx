import React from 'react';

import Main from '../../components/Main';
import withUser from '../../hoc/withUser';
import Content from '../../components/core/Container';

function MainPage() {
  return (
    <Content heading="Main">
      <Main />
    </Content>
  );
}

export default withUser(MainPage, false);
