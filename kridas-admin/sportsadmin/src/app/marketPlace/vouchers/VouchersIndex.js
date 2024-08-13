import { makeStyles } from '@material-ui/core';
import React from 'react'
import PageContainer from '../../common/layout/components/PageContainer';
import VouchersList from './VouchersList';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
}));

const VouchersIndex = () => {
  const classes = useStyles();

  return (
    <PageContainer heading="Vouchers">
      <div className={classes.root}>
        <VouchersList />
      </div>
    </PageContainer>
  );
}

export default VouchersIndex