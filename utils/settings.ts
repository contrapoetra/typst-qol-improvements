export type NotificationStyle = "overlay" | "toast";

export interface Settings {
  notificationStyle: NotificationStyle;
  showDelay: number;
  hideDelay: number;
}

export const settings = storage.defineItem<Settings>("local:settings", {
  defaultValue: {
    notificationStyle: "overlay",
    showDelay: 2000,
    hideDelay: 1000,
  },
});
