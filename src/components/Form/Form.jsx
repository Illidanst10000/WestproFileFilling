import React, {useCallback, useEffect, useState} from 'react';
import './Form.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useTelegram} from "../hooks/useTelegram";
const Form = () => {
    const projects = {
        ComberWay: {value: "Delta" },
        BridgeView: {value: "NV" },
        Horizons: {value: "BBy" },
    };

    const [project, setProject] = useState('');
    const [hours, setHours] = useState('');
    const [date, setDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [cleanup, setCleanup] = useState(true);
    const [growth, setGrowth] = useState(false);
    const [mowing, setMowing] = useState(false);
    const [mechanical, setMechanical] = useState(false);
    const [aerification, setAerification] = useState(false);
    const [blowing, setBlowing] = useState(true);
    const [fertilization, setFertilization] = useState(false);
    const [liming, setLiming] = useState(false);
    const [weeding1, setWeeding1] = useState(false);
    const [weeding2, setWeeding2] = useState(true);
    const [weeding3, setWeeding3] = useState(false);
    const [weeding4, setWeeding4] = useState(false);
    const [extra, setExtra] = useState('');
    const [comments1, setComments1] = useState('');
    const [comments2, setComments2] = useState('');
    const [signature, setSignature] = useState('NB');

    const checkboxes = [
        { label: 'Cleanup', value: cleanup, setValue: setCleanup },
        { label: 'Growth', value: growth, setValue: setGrowth },
        { label: 'Mowing', value: mowing, setValue: setMowing },
        { label: 'Mechanical', value: mechanical, setValue: setMechanical },
        { label: 'Aerification', value: aerification, setValue: setAerification },
        { label: 'Blowing', value: blowing, setValue: setBlowing },
        { label: 'Fertilization', value: fertilization, setValue: setFertilization },
        { label: 'Liming', value: liming, setValue: setLiming },
        { label: 'Weed lawns', value: weeding1, setValue: setWeeding1 },
        { label: 'Weeding', value: weeding2, setValue: setWeeding2 },
        { label: 'Weed bed areas', value: weeding3, setValue: setWeeding3 },
        { label: 'Weed shrubs', value: weeding4, setValue: setWeeding4 },
    ];

    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            project, hours, date, location,
            cleanup, growth, mowing, mechanical, aerification, blowing, fertilization,
            liming, weeding1, weeding2, weeding3, weeding4,
            extra, comments1, comments2, signature
        }
        tg.sendData(JSON.stringify(data))

    }, [project, hours, date, location,
        cleanup, growth, mowing, mechanical, aerification, blowing, fertilization,
        liming, weeding1, weeding2, weeding3, weeding4,
        extra, comments1, comments2, signature])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Send'
        })
    }, [])

    useEffect(() => {
        if(!project || !date || !hours || !location || !signature) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [project, date, hours, location, signature])

    useEffect(() => {
        const comments = [];
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].value) {
                comments.push(checkboxes[i].label)
            }
        }
        setComments1(comments);
    }, [setComments1])

    useEffect(() => {
        // Если выбран проект из списка, то получаем его объект с информацией о локации
        const selectedProject = projects[project];
        // Если такой объект существует, то устанавливаем его значение location в качестве значения поля локации
        if (selectedProject) {
            setLocation(selectedProject.value);
        }
    }, [project, projects, setLocation]);

    const generateComments = (checkbox) => {
        const { label, value } = checkbox;

        const comments = [...comments1, label]
        if (value) {
            setComments1(comments);
        } else {
            let index = comments1.indexOf(label);
            comments1.splice(index, 1);
            setComments1(comments1);
        }
    }

    return (
        <div className={'form'}>
            <label>
                Project:
                <select value={project} onChange={(e) => setProject(e.target.value)}>
                    <option value="">Select a project</option>
                    {Object.keys(projects).map((project) => (
                        <option value={project} key={project}>
                            {project}
                        </option>
                    ))}
                </select>
            </label>


            <label>
                Hours:
                <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} />
            </label>

            <label>
                Date:
                <DatePicker selected={date} onChange={(d) => setDate(d)} />
            </label>

            <label>
                Location:
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </label>

            {checkboxes.map(({ label, value, setValue }) => (
                <label key={label}>
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                            setValue(e.target.checked);
                            generateComments({ label: label, value: e.target.checked });
                        }}
                    />
                    {label}
                </label>
            ))}



            <label>
                Extra:
                <input type="text" value={extra} onChange={(e) => setExtra(e.target.value)} />
            </label>

            <label>
                Comments 1:
                <input type="text" value={comments1} onChange={(e) => setComments1(e.target.value)} />
            </label>

            <label>
                Comments 2:
                <input type="text" value={comments2} onChange={(e) => setComments2(e.target.value)} />
            </label>

            <label>
                Signature:
                <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} />
            </label>
        </div>
    );
};

export default Form;