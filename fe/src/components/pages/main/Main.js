import React, { useState } from 'react';

import { Input, Button, Table } from 'rsuite';

const { Column, HeaderCell, Cell, Pagination } = Table;

const Main = () => {
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState('');
  const [emailFormatInvalid, setEmailFormatInvalid] = useState(false);

  const validateEmailRegex = email => {
    if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setEmails([
        ...emails,
        {
          email,
          wellFormed: undefined,
          validDomain: undefined,
          validMailbox: undefined,
          isLoading: 'false'
        }
      ]);
      setEmail('');
      setEmailFormatInvalid('false');
    } else {
      setEmailFormatInvalid('true');
    }
  };

  const validateEmails = () => {
    emails.forEach(emailObject => {
      setEmails(emails.map(email => ({ ...email, isLoading: 'true' })));

      fetch(`/api/${emailObject.email}`)
        .then(res => res.json())
        .then(json => {
          const newEmails = [...emails];
          newEmails[
            emails.findIndex(obj => obj.email === emailObject.email)
          ] = {
            ...emailObject,

            wellFormed: json.wellFormed
              ? json.wellFormed.toString()
              : 'undefined',

            validDomain: json.validDomain
              ? json.validDomain.toString()
              : 'undefined',

            validMailbox: json.validMailbox
              ? json.validMailbox.toString()
              : 'undefined',
            isLoading: 'false'
          };

          console.log({ ...emailObject, ...json, isLoading: 'false' });
          setEmails(newEmails);
        });
    });
  };

  console.log(emails);
  return (
    <>
      <Table
        height={400}
        data={emails}
        onRowClick={data => {
          console.log(data);
        }}
      >
        <Column width={300} align='center' fixed>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey='email' />
        </Column>

        <Column fixed>
          <HeaderCell>Valid Format</HeaderCell>
          <Cell dataKey='wellFormed' />
        </Column>

        <Column>
          <HeaderCell>Valid Domain</HeaderCell>
          <Cell dataKey='validDomain' />
        </Column>

        <Column>
          <HeaderCell>Valid Mailbox</HeaderCell>
          <Cell dataKey='validMailbox' />
        </Column>

        <Column>
          <HeaderCell>Loading</HeaderCell>
          <Cell dataKey='isLoading' />
        </Column>

        {/* <Column fixed='right'>
          <HeaderCell>Action</HeaderCell>

          <Cell>
            {rowData => {
              function handleAction() {
                alert(`id:${rowData.id}`);
              }
              return (
                <span>
                  <a onClick={handleAction}> Edit </a> |{' '}
                  <a onClick={handleAction}> Remove </a>
                </span>
              );
            }}
          </Cell>
        </Column> */}
      </Table>

      <Input
        size='lg'
        style={{ ...(emailFormatInvalid ? { border: '1px solid red' } : {}) }}
        onChange={value => {
          setEmail(value);
        }}
        type='email'
        placeholder='name@example.com'
        value={email}
      />

      <br />
      <br />
      <br />

      <Button variant='primary' onClick={() => validateEmailRegex(email)}>
        Add
      </Button>

      <Button color='orange' onClick={() => validateEmails()}>
        VALIDATE
      </Button>
    </>
  );
};

export default Main;
