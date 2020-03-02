/**** Delay the execution functions for testing purpose ***/
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};

export const doSomething = async (ms) => {
  await sleep(ms)
};

/**** call like this to delayed the execution  ***/
// await doSomething(500);

export function hasCompanyId(state) {
  return Boolean(state.account.company_id);
}

export function queryStringToObj(search) {
  return JSON.parse(
    '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    function(key, value) {
      return key === "" ? value : decodeURIComponent(value);
    }
  );
}

export function mapStatusToBtnClass(status) {
  let className = '';

  if (status === 'active'){
    className = 'btn-success';
  }
  if (status === 'inactive'){
    className = 'btn-secondary';
  }
  if (status === 'confirmed'){
    className = 'btn-info';
  }
  if (status === 'pending'){
    className = 'btn-warning';
  }
  if (status === 'cancelled'){
    className = 'btn-secondary';
  }

  return className;
}
