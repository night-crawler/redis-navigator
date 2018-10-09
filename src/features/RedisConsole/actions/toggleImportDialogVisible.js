export const TOGGLE_IMPORT_DIALOG_VISIBLE = 'redisNavigator/ui/console/toggleImportDialogVisible';


export const toggleImportDialogVisible = (instanceName, isVisible) => ({
  type: TOGGLE_IMPORT_DIALOG_VISIBLE,
  payload: {
    isVisible,
  },
  meta: { path: instanceName },
});
