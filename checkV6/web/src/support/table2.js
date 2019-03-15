/**
 * Created by Xiaodong on 2017/3/13.
 */
export default {
    data() {
        return {
            tableData: null,
            pagination: {
                current: 1,
                size: 20,
                total: 0
            },
            tableSum: [],
            tableSelection: []
        }
    },
    methods: {
        getSelectIdList(key) {
            var ret = [];
            for(var i = 0 ; i < this.tableSelection.length; i ++) {
                ret.push(this.tableSelection[i][key]);
            }
            return ret;
        },
        handleCurrentChange(currentPage) {
            this.pagination.current = currentPage;
        },
        handleSizeChange(size) {
            this.pagination.size = size;
        },
        handleSelectionChange(val) {
            this.tableSelection = val;
        },
        setPageData(result) {
            //alert(JSON.stringify(result.length))
            this.pagination.total = result.total;
            this.tableData = result.data;
        },
        sumPage(k) {
            var total = 0;
            for(var i = 0; i < this.tableData.length; i ++) {
                if(this.tableData[i][k]) total += parseFloat(this.tableData[i][k])
            }
            return total.toFixed(2);
        },
        formatStartDate(val) {
            if(!val) return null;
            return new Date(val).Format('yyyy/MM/dd 00:00:00');
        },
        formatEndDate(val) {
            if(!val) return null;
            return new Date(val).Format('yyyy/MM/dd 23:59:59');
        }
    }
}
