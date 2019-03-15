/**
 * Created by Xiaodong on 2017/3/13.
 */
export default {
    data(){
        return { dialogLoading : false ,dialogTitle:'',dialogSwitch:{}}
    },
    methods: {
        openDialog(val,title) {
            this.dialogTitle = title;
            this.$set(this.dialogSwitch,val,true);
        },
        openDialogForm(val,formNames) {
            if(formNames && formNames.length > 0) {
                for(let i = 0; i < formNames.length; i++) {
                    let formItem = formNames[i];
                    let form = this.$refs[formItem];
                    if (form) form.resetFields();
                }
            }
            this.$set(this.dialogSwitch,val,true);
        },
        closeDialog(val) {
            this.$set(this.dialogSwitch,val,false);
        },
        startDialogLoading() {
            this.dialogLoading = true;
        },
        stopDialogLoading() {
            this.dialogLoading = false;
        }
    }
}
