import { useQuery } from '@tanstack/react-query';
import { Button, Col, DatePicker, Divider, Input, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { stateList } from '~/constants/api.constant';
import useCarehomes from '~/pages/CareHome/hooks/useCarehomes';
import { get } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';

import state from '../constants/stateList.json';

const FilterSearch = ({
  setItem,
  model,
  filterItems,
  trigger,
  paginationProps,
  ...props
}) => {
  const { limit, page, setLimit, setPage } = paginationProps;
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [cityId, setCityId] = useState('');
  const [careType, setCareType] = useState('');
  const [verify, setVerify] = useState('');
  const [publish, setPublish] = useState('');
  const [date, setDate] = useState('');

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterItem, setFilterItem] = useState(filterItems);

  const { data: careTypes } = useQuery(
    ['care type of care home'],
    () => get(getUrlForModel('CareTypes')),
    { staleTime: 0, refetchOnWindowFocus: false },
  );

  const { useCareHomesData, useCitiesData } = useCarehomes();

  const {
    isLoading,
    isError,
    error,
    data: fetchData,
    refetch: refetchSearch,
  } = useCareHomesData({
    limit,
    page,
    query,
    state,
    postcode,
    city: cityId,
    careType,
    verify,
    publish,
    date,
  });

  const { data: cities } = useCitiesData();

  useEffect(() => {
    setItem(fetchData?.data);
  }, [fetchData]);

  const handleFilter = (value) => {
    setSelectedFilter({ value });
  };
  const searchFunction = (query) => {
    refetchSearch();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchFunction(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, state, postcode]);

  useEffect(() => {
    refetchSearch();
  }, [cityId, careType, verify, publish, date]);

  const handleInputChange = ({ e, setter }) => {
    const { value } = e.target;
    setter(value);
  };
  const handleSelectInputChange = ({ option, key = 'id', setter }) => {
    console.log(option);

    setter(option[key] ?? '');
  };

  const onChange = (value: string) => {
    setCityId(value);
    // refetchSearch();
  };
  const onChangeState = (value: string) => {
    setState(value);
    // refetchSearch();
  };

  const onSearch = (value: string) => {
    setCity(value);
  };
  const onSearchState = (value: string) => {
    setState(value);
  };

  const filterOption = (input: string, option?: { name: string; id: string }) => {
    return (option?.name ?? '').toLowerCase().includes(input.toLowerCase());
  };
  return (
    <Space
      className="filter-search"
      direction="vertical"
      size="middle"
      style={{
        width: '100%',
        padding: '12px 25px',
        borderRadius: '15px',
        backgroundColor: '#FFF',
      }}
    >
      <Row gutter={24}>
        <Col span={6}>
          <div style={{ width: '100%' }}>
            <Input
              addonBefore="Name:"
              id="query"
              allowClear
              bordered={false}
              style={{ width: '100% !important' }}
              width={100}
              value={query}
              onChange={(e) => handleInputChange({ e, setter: setQuery })}
              placeholder="Please enter the care homes name"
              autoFocus
            />
          </div>
        </Col>

        <Col span={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label>City:</label>
          <Select
            id="city"
            bordered={false}
            allowClear={true}
            showSearch
            placeholder="Select a city"
            optionFilterProp="children"
            onChange={onChange}
            value={cityId}
            onSearch={onSearch}
            filterOption={filterOption}
            options={cities?.data}
            fieldNames={{ label: 'name', value: 'id' }}
            searchValue={city}
            style={{ width: '100%' }}
          />
        </Col>

        <Col span={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* <div style={{ width: "100%" }}>
            <Input
              addonBefore="State:"
              id="state"
              allowClear
              bordered={false}
              style={{ width: '100% !important' }}
              onChange={(e) => handleInputChange({ e, setter: setState })}
              placeholder="Please enter the care homes name"
              autoFocus
            />
          </div> */}
          <label>State:</label>
          <Select
            id="state"
            bordered={false}
            allowClear={true}
            showSearch
            placeholder="Select a state"
            optionFilterProp="children"
            onChange={onChangeState}
            value={state}
            // onSearch={onSearchState}
            filterOption={filterOption}
            options={stateList}
            fieldNames={{ label: 'name', value: 'name' }}
            // searchValue={state}
            style={{ width: '100%' }}
          />
        </Col>

        <Col span={6}>
          <Space>
            <Input
              addonBefore="Postal Code:"
              id="postcode"
              allowClear
              type="string"
              bordered={false}
              style={{ width: '100%' }}
              onChange={(e) => handleInputChange({ e, setter: setPostcode })}
              autoFocus
            />
          </Space>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ whiteSpace: 'nowrap', paddingLeft: '10px' }}>
            Living Options:
          </label>
          <Select
              id="careType"
              bordered={false}
              allowClear={true}
              showSearch
              placeholder="Select a living options"
              optionFilterProp="children"
              onChange={(e, option) =>
                  handleSelectInputChange({ option, key: 'id', setter: setCareType })
              }
              value={careType}
              onSearch={onSearch}
              filterOption={filterOption}
              options={careTypes?.data}
              fieldNames={{ label: 'name', value: 'id' }}
              searchValue={city}
              style={{ width: '100%' }}
          />
        </Col>

        <Col span={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ whiteSpace: 'nowrap' }}>Verified :</label>
          <Select
              placeholder="Select a verify type"
              allowClear
              bordered={false}
              value={verify}
              onChange={(e, option) =>
                  handleSelectInputChange({ option, key: 'value', setter: setVerify })
              }
              options={[
                { value: 'true', label: 'Verified' },
                { value: 'false', label: 'Not Verified' },
              ]}
              style={{ width: '100%' }}
          />
        </Col>

        <Col span={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ whiteSpace: 'nowrap' }}>Published :</label>
          <Select
              placeholder="Select a publish Type"
              allowClear
              bordered={false}
              onChange={(e, option) =>
                  handleSelectInputChange({ option, key: 'value', setter: setPublish })
              }
              value={publish}
              options={[
                { value: 'true', label: 'publish' },
                { value: 'false', label: 'Not publish' },
              ]}
              style={{ width: '100%' }}
          />
        </Col>
        <Col span={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ whiteSpace: 'nowrap', marginLeft: '10px' }}>Created at :</label>
          <Space direction="vertical" style={{ width: '100%' }}>
            <DatePicker
                allowClear
                bordered={false}
                value={date ? dayjs(date) : null}
                onChange={(date, dateString) => {
                  console.log('date: ', date, dateString);
                  handleSelectInputChange({
                    option: { value: dateString },
                    key: 'value',
                    setter: setDate,
                  });
                }}
            />
          </Space>
          <Button
              type="primary"
              onClick={() => {
                setQuery('');
                setState('');
                setPostcode('');
                setCity('');
                setCityId('');
                setCareType('');
                setVerify('');
                setPublish('');
                setDate('');
              }}
          >
            Clear All Filter
          </Button>
        </Col>
      </Row>
    </Space>
  );
};
export default FilterSearch;
