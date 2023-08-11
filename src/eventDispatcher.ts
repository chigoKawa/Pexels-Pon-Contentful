const eventDispatcher = {
    dispatch(eventName: string, data?: any) {
      const event = new CustomEvent(eventName, { detail: data });
      window.dispatchEvent(event);
    },
  
    subscribe(eventName: string, callback: (event : any) => void) {
      window.addEventListener(eventName, callback);
    },
  
    unsubscribe(eventName: string, callback: (event : any) => void) {
      window.removeEventListener(eventName, callback);
    },
  };
  
  export default eventDispatcher;
  
  