import React from "react";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import axios from "axios";

class Widget extends React.Component {
  state = {
    selected: [],
    options: [],
    userSelection: {
      added: [],
      removed: [],
    },
    userFetched: [],
  };

  onChange = (selected) => {
    //debugger;
    let data = [];
    this.setState({ selected });
    for (let i = 0; i < selected.length; i++) {
      let obj = { id: selected[i] };
      data.push(obj);
    }
    this.props.setNpiDetail(data);
  };

  fetchData = async () => {
    // //debugger;
    let me = this;
    let idToken = (this.props.id !== undefined) ? this.props.id : localStorage.getItem("idToken");
    let config = {
      method: "get",
      url: process.env.REACT_APP_BEATS_GET_PAYER_TYPE_API,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    };

    console.log("URL: ", process.env.REACT_APP_BEATS_FETCH_PROVIDER_PAYER_LIST);
    let providerPayerConfig = {
      method: "post",
      url: process.env.REACT_APP_BEATS_FETCH_PROVIDER_PAYER_LIST,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
    };

    this.props.loading(true);
    try {
      let payerData = await axios(config);
      let providerPayerData = await axios(providerPayerConfig);
      let optionsData = [];
      let selectedPayerData = [];
      let data = payerData.data;
      let providerSelectedPayer = providerPayerData.data;
//      let providerSelectedPayer = [];
      for (var i = 0; i < data.length; i++) {
        let obj = {
          value: data[i].payor_external_id,
          label: data[i].payor_external_id + " - " + data[i].payor_name,
        };
        optionsData.push(obj);
      }
      providerSelectedPayer.forEach((element) => {
        selectedPayerData.push(element.payor_external_id);
      });
      let payerPropData = [];
      for (let i = 0; i < selectedPayerData.length; i++) {
        let obj = { id: selectedPayerData[i] };
        payerPropData.push(obj);
      }
      this.props.setNpiDetail(payerPropData);
      me.setState({
        ...me.state,
        options: optionsData,
        selected: selectedPayerData,
        userFetched: selectedPayerData
      });
      this.props.loading(false);
    } catch (err) {
      this.props.loading(false);
      console.log(err);
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { selected, options } = this.state;

    return (
      <DualListBox
        canFilter
        filterCallback={(option, filterInput) => {
          if (filterInput === "") {
            return true;
          }

          return new RegExp(filterInput, "i").test(option.label);
        }}
        filterPlaceholder="Payers"
        options={options}
        selected={selected}
        onChange={this.onChange}
        icons={{
          moveLeft: '<',
          moveAllLeft: '<<',
          moveRight: '>',
          moveAllRight: '>>'
        }}
      />
    );
  }
}

export default Widget;
