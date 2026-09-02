import { mount } from '@vue/test-utils';
import { nextTick, reactive, ref } from 'vue';
import Table from '../table';
import { TableChangeExtra, TableColumnData, TableData } from '../interface';
import { getFixedNumber } from '../utils';

const demoData = [
  {
    key: '1',
    name: 'Jane Doe1',
    age: 1,
  },
  {
    key: '2',
    name: 'Jane Doe2',
    age: 2,
  },
  {
    key: '3',
    name: 'Jane Doe3',
    age: 3,
  },
  {
    key: '4',
    name: 'Jane Doe4',
    age: 4,
  },
  {
    key: '5',
    age: 5,
    name: 'Jane Doe5',
  },
];
const demoColumns: TableColumnData[] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
];
const JSONCopy = (val: unknown) => JSON.parse(JSON.stringify(val));
describe('Table', () => {
  test('Correct rendering after deleting data on the last page', async () => {
    const data = reactive(JSONCopy(demoData));
    const columns = JSONCopy(demoColumns);
    const current = ref(5);
    const handleChange = (data: number) => {
      current.value = data;
    };
    const pagination = reactive({
      current,
      onChange: handleChange,
      pageSize: 1,
    });
    const wrapper = mount(Table as any, {
      props: {
        columns,
        data,
        pagination,
      },
    });
    await nextTick();
    let content = wrapper.find('.arco-table-td-content').element.innerHTML;
    expect(content).toBe('Jane Doe5');
    data.pop();
    await nextTick();
    content = wrapper.find('.arco-table-td-content').element.innerHTML;
    expect(content).toBe('Jane Doe4');
  });

  test('table sort', async () => {
    const data = reactive(JSONCopy(demoData));
    const columns = JSONCopy(demoColumns);
    columns[1].sortable = {
      sortDirections: ['ascend', 'descend'],
    };
    let testSortRes = {
      data: [] as TableData[],
      extra: {} as TableChangeExtra,
      currentDataSource: [] as TableData[],
    };
    const handleChange = (
      data: TableData[],
      extra: TableChangeExtra,
      currentDataSource: TableData[]
    ) => {
      testSortRes = { data, extra, currentDataSource };
    };
    const wrapper = mount(Table as any, {
      props: {
        columns,
        data,
        onChange: handleChange,
        pagination: {
          pageSize: 2,
        },
      },
    });
    await nextTick();
    wrapper.find('.arco-table-cell-with-sorter').trigger('click');
    expect(testSortRes.data[0].key).toBe('1');
    expect(testSortRes.extra.sorter?.direction).toBe('ascend');
    expect(testSortRes.currentDataSource).toBeTruthy();
    expect(testSortRes.currentDataSource.length).toBe(5);
    expect(testSortRes.currentDataSource[0].key).toBe('1');
    expect(testSortRes.currentDataSource[4].key).toBe('5');
    await nextTick();
    wrapper.find('.arco-table-cell-with-sorter').trigger('click');
    expect(testSortRes.data[0].key).toBe('5');
    expect(testSortRes.extra.sorter?.direction).toBe('descend');
    expect(testSortRes.currentDataSource).toBeTruthy();
    expect(testSortRes.currentDataSource.length).toBe(5);
    expect(testSortRes.currentDataSource[0].key).toBe('5');
    expect(testSortRes.currentDataSource[4].key).toBe('1');
  });

  test('virtual list renders rows with stable keys', async () => {
    const data = reactive(
      Array.from({ length: 40 }, (_, index) => ({
        key: `row-${index}`,
        name: `User ${index}`,
        age: index,
      }))
    );
    const wrapper = mount(Table as any, {
      props: {
        columns: demoColumns,
        data,
        pagination: false,
        virtualListProps: { height: 200 },
      },
    });
    await nextTick();
    expect(wrapper.find('.arco-virtual-list').exists()).toBe(true);
    const rows = wrapper.findAll('.arco-table-tr');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(40);
    expect(wrapper.text()).toContain('User 0');
  });

  test('virtual list uses custom scrollbar when enabled', async () => {
    const data = reactive(
      Array.from({ length: 30 }, (_, index) => ({
        key: `row-${index}`,
        name: `User ${index}`,
        age: index,
      }))
    );
    const wrapper = mount(Table as any, {
      props: {
        columns: demoColumns,
        data,
        pagination: false,
        scrollbar: true,
        virtualListProps: { height: 200 },
      },
    });
    await nextTick();
    expect(wrapper.find('.arco-scrollbar').exists()).toBe(true);
    expect(wrapper.find('.arco-scrollbar-container').exists()).toBe(true);
    expect(wrapper.find('.arco-virtual-list').exists()).toBe(true);
  });

  test('fixed column offsets prefer measured widths', () => {
    const columns: TableColumnData[] = [
      { title: 'A', dataIndex: 'a', width: 100, fixed: 'left' },
      { title: 'B', dataIndex: 'b', width: 100, fixed: 'left' },
      { title: 'C', dataIndex: 'c', width: 200 },
      { title: 'D', dataIndex: 'd', width: 80, fixed: 'right' },
      { title: 'E', dataIndex: 'e', width: 120, fixed: 'right' },
    ];
    const measured = { a: 140, b: 160, d: 90, e: 110 };

    expect(
      getFixedNumber(columns[0], {
        dataColumns: columns,
        operations: [],
        columnWidth: measured,
      })
    ).toBe(0);
    expect(
      getFixedNumber(columns[1], {
        dataColumns: columns,
        operations: [],
        columnWidth: measured,
      })
    ).toBe(140);
    expect(
      getFixedNumber(columns[4], {
        dataColumns: columns,
        operations: [],
        columnWidth: measured,
      })
    ).toBe(0);
    expect(
      getFixedNumber(columns[3], {
        dataColumns: columns,
        operations: [],
        columnWidth: measured,
      })
    ).toBe(110);
    // Without measured widths, fall back to declared width
    expect(
      getFixedNumber(columns[1], {
        dataColumns: columns,
        operations: [],
      })
    ).toBe(100);
  });

  test('selectAll(false) keeps other-page keys; clearSelected clears all', async () => {
    const data = reactive(
      Array.from({ length: 4 }, (_, index) => ({
        key: `row-${index}`,
        name: `User ${index}`,
        age: index,
      }))
    );
    const selectedKeys = ref<string[]>(['row-0', 'row-2']);
    const wrapper = mount(Table as any, {
      props: {
        'columns': demoColumns,
        data,
        'pagination': { pageSize: 2 },
        'rowSelection': { type: 'checkbox', showCheckedAll: true },
        'selectedKeys': selectedKeys.value,
        'onUpdate:selectedKeys': (keys: string[]) => {
          selectedKeys.value = keys;
          wrapper.setProps({ selectedKeys: keys });
        },
      },
    });
    await nextTick();

    (wrapper.vm as any).selectAll(false);
    await nextTick();
    // page 1 keys removed; page 2 key kept
    expect(selectedKeys.value).toEqual(['row-2']);

    selectedKeys.value = ['row-0', 'row-2'];
    await wrapper.setProps({ selectedKeys: selectedKeys.value });
    (wrapper.vm as any).clearSelected();
    await nextTick();
    expect(selectedKeys.value).toEqual([]);
  });

  test('tree selection header is checked when all leaves selected', async () => {
    const treeData = [
      {
        key: 'p1',
        name: 'Parent',
        children: [
          { key: 'c1', name: 'Child1', age: 1 },
          { key: 'c2', name: 'Child2', age: 2 },
        ],
      },
    ];
    const wrapper = mount(Table as any, {
      props: {
        columns: demoColumns,
        data: treeData,
        pagination: false,
        defaultExpandAllRows: true,
        rowSelection: {
          type: 'checkbox',
          showCheckedAll: true,
          checkStrictly: false,
        },
        selectedKeys: ['c1', 'c2'],
      },
    });
    await nextTick();
    const headerCheckbox = wrapper.find('.arco-table-th .arco-checkbox');
    expect(headerCheckbox.exists()).toBe(true);
    expect(headerCheckbox.classes().join(' ')).toContain(
      'arco-checkbox-checked'
    );
    expect(headerCheckbox.classes().join(' ')).not.toContain(
      'arco-checkbox-indeterminate'
    );
  });

  test('rowSelection.checkboxProps can disable a row', async () => {
    const wrapper = mount(Table as any, {
      props: {
        columns: demoColumns,
        data: [
          { key: '1', name: 'Alice', age: 18 },
          { key: '2', name: 'Bob', age: 22 },
        ],
        pagination: false,
        rowSelection: {
          type: 'checkbox',
          showCheckedAll: true,
          checkboxProps: (record: { key: string }) => ({
            disabled: record.key === '2',
          }),
        },
      },
    });
    await nextTick();
    const checkboxes = wrapper.findAll('.arco-table-td .arco-checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0].classes().join(' ')).not.toContain(
      'arco-checkbox-disabled'
    );
    expect(checkboxes[1].classes().join(' ')).toContain(
      'arco-checkbox-disabled'
    );
  });
});
